/** Portable font identification, separate from document decoding. */
import { sha256 } from '@noble/hashes/sha2.js';
import type { TextmodeDocumentFontReference } from './types/wire.js';

export type FontIdentityResult =
	| { ok: true; font: TextmodeDocumentFontReference }
	| { ok: false; error: { code: 'INVALID_FONT' | 'UNSUPPORTED_FONT' | 'LIMIT_EXCEEDED'; message: string } };

/**
 * Identify a decoded standalone SFNT font without loading or rendering it.
 *
 * @example
 * ```ts
 * const result = identifySfntFont(font.sourceData.copyBytes());
 * if (result.ok) console.log(result.font.id);
 * ```
 */
export function identifySfntFont(bytes: Uint8Array): FontIdentityResult {
	const failure = (
		code: 'INVALID_FONT' | 'UNSUPPORTED_FONT' | 'LIMIT_EXCEEDED',
		message: string
	): FontIdentityResult => ({ ok: false, error: { code, message } });
	if (!(bytes instanceof Uint8Array) || bytes.length < 12) return failure('INVALID_FONT', 'Truncated SFNT header.');
	if (bytes.length > 16 * 1024 * 1024) return failure('LIMIT_EXCEEDED', 'Font exceeds 16 MiB.');
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const flavor = view.getUint32(0);
	if (![0x00010000, 0x74727565, 0x4f54544f].includes(flavor))
		return failure('UNSUPPORTED_FONT', 'Use decoded standalone TTF or OTF data.');
	const count = view.getUint16(4);
	if (!count || count > 256) return failure('LIMIT_EXCEEDED', 'SFNT requires 1–256 tables.');
	const end = 12 + count * 16;
	if (end > bytes.length) return failure('INVALID_FONT', 'Truncated SFNT directory.');
	const tables: { tag: number; start: number; length: number }[] = [];
	const tags = new Set<number>();
	for (let i = 0; i < count; i++) {
		const p = 12 + i * 16;
		const tag = view.getUint32(p),
			start = view.getUint32(p + 8),
			length = view.getUint32(p + 12);
		if (tags.has(tag) || start < end || start + length > bytes.length)
			return failure('INVALID_FONT', 'Duplicate or out-of-bounds SFNT table.');
		tags.add(tag);
		tables.push({ tag, start, length });
	}
	const ranges = [...tables].filter((t) => t.length > 0).sort((a, b) => a.start - b.start);
	if (ranges.some((t, i) => i > 0 && t.start < ranges[i - 1].start + ranges[i - 1].length))
		return failure('INVALID_FONT', 'Overlapping SFNT tables.');
	const head = tables.find((t) => t.tag === 0x68656164);
	if (!head || head.length < 12) return failure('INVALID_FONT', 'Missing or truncated head table.');
	const included = tables.filter((t) => t.tag !== 0x44534947).sort((a, b) => a.tag - b.tag);
	const hash = sha256.create();
	hash.update(Uint8Array.from('textmode.font.sfnt.v1\0', (c) => c.charCodeAt(0)));
	hash.update(bytes.subarray(0, 4));
	const number = new Uint8Array(2);
	new DataView(number.buffer).setUint16(0, included.length);
	hash.update(number);
	for (const table of included) {
		const prefix = new Uint8Array(8),
			p = new DataView(prefix.buffer);
		p.setUint32(0, table.tag);
		p.setUint32(4, table.length);
		hash.update(prefix);
		const data = bytes.subarray(table.start, table.start + table.length);
		if (table === head) {
			hash.update(data.subarray(0, 8));
			hash.update(new Uint8Array(4));
			hash.update(data.subarray(12));
		} else hash.update(data);
	}
	const digest = Array.from(hash.digest(), (n) => n.toString(16).padStart(2, '0')).join('');
	const name = readName(
		bytes,
		tables.find((t) => t.tag === 0x6e616d65)
	);
	return { ok: true, font: { id: `sfnt-v1-sha256:${digest}`, ...(name ? { name } : {}) } };
}

function readName(bytes: Uint8Array, table?: { start: number; length: number }): string | undefined {
	if (!table || table.length < 6) return;
	const v = new DataView(bytes.buffer, bytes.byteOffset + table.start, table.length);
	const count = v.getUint16(2),
		storage = v.getUint16(4);
	if (count > 4096 || 6 + count * 12 > table.length || storage < 6 + count * 12) return;
	const names: { id: number; rank: number; text: string }[] = [];
	for (let i = 0; i < count; i++) {
		const p = 6 + i * 12,
			platform = v.getUint16(p),
			encoding = v.getUint16(p + 2);
		const language = v.getUint16(p + 4),
			id = v.getUint16(p + 6);
		const length = v.getUint16(p + 8),
			start = storage + v.getUint16(p + 10);
		if (
			![6, 4].includes(id) ||
			!(platform === 0 || (platform === 3 && [0, 1, 10].includes(encoding))) ||
			length % 2 ||
			length > 8192 ||
			start < storage ||
			start + length > table.length
		)
			continue;
		let text = '';
		for (let n = 0; n < length; n += 2) text += String.fromCharCode(v.getUint16(start + n));
		text = text.trim();
		if (
			!text ||
			Array.from(text).some((c) => c.charCodeAt(0) < 32 || (c.charCodeAt(0) >= 127 && c.charCodeAt(0) <= 159)) ||
			!wellFormed(text)
		)
			continue;
		names.push({ id, rank: language === 0x409 ? 0 : platform === 0 ? 1 : 2, text });
	}
	names.sort((a, b) => (a.id === 6 ? 0 : 1) - (b.id === 6 ? 0 : 1) || a.rank - b.rank);
	return names[0]?.text;
}

function wellFormed(text: string): boolean {
	for (let i = 0; i < text.length; i++) {
		const n = text.charCodeAt(i);
		if (n >= 0xd800 && n <= 0xdbff) {
			const low = text.charCodeAt(++i);
			if (!(low >= 0xdc00 && low <= 0xdfff)) return false;
		} else if (n >= 0xdc00 && n <= 0xdfff) return false;
	}
	return true;
}
