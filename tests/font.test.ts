import { readFileSync } from 'node:fs';
import { createHash, webcrypto } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { identifySfntFont } from '../src/font.js';
import { decodeTextmodeDocument } from '../src/index.js';
import { compileSchema } from './support/schema.js';

// A small complete directory permits independent canonical-stream checks.
function sfnt(reverse = false, adjustment = 0, payload = 1) {
	const tables = [
		{ tag: 'head', data: new Uint8Array(12) },
		{ tag: 'test', data: new Uint8Array([payload]) },
		{ tag: 'DSIG', data: new Uint8Array([9]) },
	];
	tables[0].data[8] = adjustment;
	if (reverse) tables.reverse();
	const bytes = new Uint8Array(80 + 32);
	const view = new DataView(bytes.buffer);
	view.setUint32(0, 0x10000);
	view.setUint16(4, tables.length);
	let offset = 64;
	tables.forEach((table, i) => {
		const p = 12 + i * 16;
		bytes.set(
			Array.from(table.tag, (c) => c.charCodeAt(0)),
			p
		);
		view.setUint32(p + 8, offset);
		view.setUint32(p + 12, table.data.length);
		bytes.set(table.data, offset);
		offset += 16;
	});
	return bytes;
}
const id = `sfnt-v1-sha256:${'a'.repeat(64)}`;
const fixture = () => ({
	...JSON.parse(readFileSync(new URL('fixtures/v3/single-layer.json', import.meta.url), 'utf8')),
	formatVersion: '3.1.0',
});
describe('font identity', () => {
	it('normalizes table order, padding, DSIG and checksum adjustment', async () => {
		const first = identifySfntFont(sfnt());
		expect(first.ok).toBe(true);
		expect(identifySfntFont(sfnt(true, 23))).toEqual(first);
		expect(identifySfntFont(sfnt(false, 0, 2))).not.toEqual(first);
		const chunks = [
			Buffer.from('textmode.font.sfnt.v1\0'),
			Buffer.from([0, 1, 0, 0, 0, 2]),
			Buffer.from('head'),
			Buffer.from([0, 0, 0, 12]),
			Buffer.alloc(12),
			Buffer.from('test'),
			Buffer.from([0, 0, 0, 1, 1]),
		];
		const native = await webcrypto.subtle.digest('SHA-256', Buffer.concat(chunks));
		if (first.ok) expect(first.font.id).toBe(`sfnt-v1-sha256:${Buffer.from(native).toString('hex')}`);
		if (first.ok)
			expect(first.font.id).toBe(
				`sfnt-v1-sha256:${createHash('sha256').update(Buffer.concat(chunks)).digest('hex')}`
			);
	});
	it('rejects invalid tables and bounds', () => {
		expect(identifySfntFont(new Uint8Array()).ok).toBe(false);
		expect(identifySfntFont(new Uint8Array(16 * 1024 * 1024 + 1))).toMatchObject({
			ok: false,
			error: { code: 'LIMIT_EXCEEDED' },
		});
		const bytes = sfnt();
		new DataView(bytes.buffer).setUint32(20, 0xffffffff);
		expect(identifySfntFont(bytes).ok).toBe(false);
		const duplicate = sfnt();
		duplicate.set(duplicate.subarray(12, 16), 28);
		expect(identifySfntFont(duplicate).ok).toBe(false);
	});
});
describe('3.1 font references', () => {
	const validate = compileSchema('3.1');
	it('preserves the reference and omits unknown fields', () => {
		const doc = fixture();
		doc.layers[0].font = { id, name: 'UrsaFont', future: true };
		expect(validate(doc)).toBe(true);
		expect(decodeTextmodeDocument(doc)).toMatchObject({
			ok: true,
			warnings: [],
			document: { formatVersion: '3.1.0', layers: [{ font: { id, name: 'UrsaFont' } }] },
		});
		const result = decodeTextmodeDocument(doc);
		if (result.ok) expect(result.document.layers[0].font).toEqual({ id, name: 'UrsaFont' });
	});
	it.each([
		null,
		{},
		{ id: 'short' },
		{ id: id.toUpperCase() },
		{ id, name: null },
		{ id, name: '' },
		{ id, name: 'x'.repeat(4097) },
	])('rejects invalid reference %j', (font) => {
		const doc = fixture();
		doc.layers[0].font = font;
		expect(validate(doc)).toBe(false);
		expect(decodeTextmodeDocument(doc).ok).toBe(false);
	});
	it('does not invent references for old or current documents', () => {
		const doc = fixture();
		expect(validate(doc)).toBe(true);
		const result = decodeTextmodeDocument({ ...doc, formatVersion: '3.0.0' });
		if (!result.ok) throw Error(result.error.message);
		expect(result.document.layers[0]).not.toHaveProperty('font');
		expect(result.document.formatVersion).toBe('3.1.0');
	});
});
