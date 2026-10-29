import {
	LEGACY_TEXTMODE_ALL_VERSION,
	LEGACY_TEXTMODE_LAYER_FORMAT,
	LEGACY_TEXTMODE_SELECTED_VERSION,
	TEXTMODE_DOCUMENT_FORMAT,
	TEXTMODE_DOCUMENT_FORMAT_VERSION,
} from './constants.js';
import { decodeAllDocument, decodeSelectedDocument, decodeV3Document, decodeV4Frames } from './decode-shapes.js';
import { parseJSON } from './parse.js';
import {
	DocumentDecodeFailure,
	decodeLayerId,
	decodeMetadata,
	fail,
	failure,
	requireRecord,
	requireString,
	resolveLimits,
} from './validation.js';
import type { DecodeContext, UnknownRecord } from './validation.js';
import type {
	CanonicalTextmodeDocumentLayer,
	TextmodeDocumentWarning,
	TextmodeDocumentDecodeOptions,
	TextmodeDocumentDecodeResult,
	TextmodeDocumentParseResult,
} from './types/index.js';

/**
 * Decode a parsed value and normalize known document fields.
 * Invalid input returns a typed failure; invalid limit configuration throws TypeError.
 *
 * @example
 * ```ts
 * import { decodeTextmodeDocument } from '@textmode/document';
 * const result = decodeTextmodeDocument({ format: 'unsupported' });
 * if (!result.ok) console.log(result.error.code);
 * ```
 */
export function decodeTextmodeDocument(
	value: unknown,
	options: TextmodeDocumentDecodeOptions = {}
): TextmodeDocumentDecodeResult {
	try {
		const limits = resolveLimits(options.limits);
		const context: DecodeContext = {
			limits,
			remainingCells: limits.maxCells,
		};
		const root = requireRecord(value, '$');
		const format = requireString(root.format, '$.format');

		const legacy = format === LEGACY_TEXTMODE_LAYER_FORMAT;
		if (format !== TEXTMODE_DOCUMENT_FORMAT && !(legacy && (options.acceptLegacy ?? true)))
			return failure('UNSUPPORTED_FORMAT', `Unsupported textmode document format: ${format}.`, '$.format');

		const version = requireString(root.formatVersion, '$.formatVersion');
		const warnings: TextmodeDocumentWarning[] = [];
		const frames =
			!legacy && version === TEXTMODE_DOCUMENT_FORMAT_VERSION
				? decodeV4Frames(root, context)
				: [{ durationMs: 100, layers: decodeHistoricalDocument(root, context, legacy) }];
		if (legacy || version !== TEXTMODE_DOCUMENT_FORMAT_VERSION) {
			warnings.push({
				code: legacy ? 'LEGACY_DOCUMENT_MIGRATED' : 'DOCUMENT_VERSION_MIGRATED',
				message: `Migrated ${format} ${version} to textmode.document ${TEXTMODE_DOCUMENT_FORMAT_VERSION}.`,
			});
			reassignDuplicateIds(frames[0].layers, context, warnings);
		}
		return {
			ok: true,
			document: {
				format: TEXTMODE_DOCUMENT_FORMAT,
				formatVersion: TEXTMODE_DOCUMENT_FORMAT_VERSION,
				...(root.metadata === undefined
					? {}
					: { metadata: decodeMetadata(root.metadata, '$.metadata', limits) }),
				frames,
			},
			warnings,
		};
	} catch (error) {
		if (error instanceof DocumentDecodeFailure) {
			return { ok: false, error: error.detail };
		}
		throw error;
	}
}

/**
 * Parse JSON syntax and decode a textmode document in one call.
 *
 * @example
 * ```ts
 * import { parseTextmodeDocumentJSON } from '@textmode/document';
 * const result = parseTextmodeDocumentJSON('{');
 * if (!result.ok) console.log(result.error.code); // INVALID_JSON
 * ```
 */
export function parseTextmodeDocumentJSON(
	json: string,
	options: TextmodeDocumentDecodeOptions = {}
): TextmodeDocumentParseResult {
	const parsed = parseJSON(json);
	if (!parsed.ok) return parsed;
	return decodeTextmodeDocument(parsed.value, options);
}

function decodeHistoricalDocument(
	root: UnknownRecord,
	context: DecodeContext,
	legacy: boolean
): CanonicalTextmodeDocumentLayer[] {
	const version = root.formatVersion;
	if (legacy) {
		if (version === LEGACY_TEXTMODE_SELECTED_VERSION) return decodeSelectedDocument(root, context);
		if (version === LEGACY_TEXTMODE_ALL_VERSION) return decodeAllDocument(root, context);
		fail(
			'UNSUPPORTED_VERSION',
			`Unsupported legacy textmode.layer version: ${String(version)}.`,
			'$.formatVersion'
		);
	}
	if (version === '3.0.0' || version === '3.1.0') return decodeV3Document(root, context);
	if (version !== '2.0.0')
		fail('UNSUPPORTED_VERSION', `Unsupported textmode.document version: ${String(version)}.`, '$.formatVersion');
	const target = requireString(root.target, '$.target');
	if (target === 'selected') return decodeSelectedDocument(root, context);
	if (target === 'all') return decodeAllDocument(root, context);
	fail('UNSUPPORTED_TARGET', `Unsupported textmode document target: ${target}.`, '$.target');
}

function reassignDuplicateIds(
	layers: CanonicalTextmodeDocumentLayer[],
	context: DecodeContext,
	warnings: TextmodeDocumentWarning[]
): void {
	const reserved = new Set(layers.map((layer) => layer.id));
	const seen = new Set<string>();
	let nextId = 1;
	layers.forEach((layer, index) => {
		const original = layer.id;
		if (seen.has(original)) {
			while (reserved.has(String(nextId))) nextId++;
			const path = `$.layers[${index}].id`;
			layer.id = decodeLayerId(String(nextId), path, context.limits);
			reserved.add(layer.id);
			warnings.push({
				code: 'LAYER_ID_REASSIGNED',
				path,
				message: `Reassigned duplicate layer ID ${JSON.stringify(original)} to ${JSON.stringify(layer.id)}.`,
			});
			nextId++;
		}
		seen.add(original);
	});
}
