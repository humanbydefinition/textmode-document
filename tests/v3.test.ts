import { readFileSync } from 'node:fs';
import { Ajv2020 } from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { describe, expect, it } from 'vitest';
import { decodeTextmodeDocument, type TextmodeDocumentJSON } from '../src/index.js';
const ajv = new Ajv2020({ validateFormats: true });
addFormats.default(ajv, { mode: 'full' });
const validate = ajv.compile(JSON.parse(readFileSync(new URL('../schemas/3.0/schema.json', import.meta.url), 'utf8')));
function fixture(name = 'single-layer'): TextmodeDocumentJSON {
	return JSON.parse(readFileSync(new URL(`fixtures/v3/${name}.json`, import.meta.url), 'utf8'));
}
describe('unified v3 documents', () => {
	it.each(['single-layer', 'layer-stack'])('validates and normalizes %s', (name) => {
		const input = fixture(name);
		expect(validate(input), JSON.stringify(validate.errors)).toBe(true);
		const result = decodeTextmodeDocument(input);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.warnings).toEqual([]);
		expect(result.document.formatVersion).toBe('3.0.0');
		expect(result.document.layers).toHaveLength(input.layers.length);
		expect(result.document).not.toHaveProperty('target');
	});
	it.each(['target', 'layer', 'grid', 'canvas'])('rejects obsolete root field %s', (key) => {
		const input = Object.assign(fixture(), { [key]: null });
		expect(validate(input)).toBe(false);
		expect(decodeTextmodeDocument(input)).toMatchObject({
			ok: false,
			error: { code: 'INVALID_DOCUMENT', path: `$.${key}` },
		});
	});
	it('requires layers and all presentation fields', () => {
		const input = fixture();
		input.layers = [];
		expect(validate(input)).toBe(false);
		expect(decodeTextmodeDocument(input)).toMatchObject({ ok: false, error: { path: '$.layers' } });
		const missing = fixture();
		Reflect.deleteProperty(missing.layers[0], 'opacity');
		expect(validate(missing)).toBe(false);
		expect(decodeTextmodeDocument(missing)).toMatchObject({ ok: false, error: { path: '$.layers[0].opacity' } });
	});
	it('checks coordinates, budgets and Unicode beyond the schema', () => {
		const input = fixture();
		input.layers[0].cells.rows[0][0].x = 99;
		expect(validate(input)).toBe(true);
		expect(decodeTextmodeDocument(input).ok).toBe(false);
		expect(decodeTextmodeDocument(fixture('layer-stack'), { limits: { maxLayers: 1 } })).toMatchObject({
			ok: false,
			error: { code: 'LIMIT_EXCEEDED' },
		});
		expect(decodeTextmodeDocument(fixture(), { limits: { maxCells: 3 } })).toMatchObject({
			ok: false,
			error: { code: 'LIMIT_EXCEEDED' },
		});
		input.layers[0].cells.rows[0][0].x = 0;
		input.layers[0].cells.rows[0][0].character = '\ud800';
		expect(decodeTextmodeDocument(input).ok).toBe(false);
	});
	it('omits unknown properties without mutating input', () => {
		const input = fixture();
		Object.assign(input, { future: true });
		Object.assign(input.layers[0], { future: true });
		const result = decodeTextmodeDocument(input);
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.document).not.toHaveProperty('future');
			expect(result.document.layers[0]).not.toHaveProperty('future');
		}
		expect(input).toHaveProperty('future');
	});
	it.each(['cellWidth', 'cellHeight'] as const)('rejects an unsafe pixel extent from %s', (metric) => {
		const input = fixture();
		input.layers[0].grid[metric] = Number.MAX_SAFE_INTEGER;
		expect(validate(input), JSON.stringify(validate.errors)).toBe(true);
		expect(decodeTextmodeDocument(input)).toMatchObject({
			ok: false,
			error: { code: 'LIMIT_EXCEEDED', path: `$.layers[0].grid.${metric}` },
		});
	});
	it('migrates v2 even when legacy textmode.layer support is disabled', () => {
		const input = JSON.parse(readFileSync(new URL('fixtures/v2/selected.json', import.meta.url), 'utf8'));
		const result = decodeTextmodeDocument(input, { acceptLegacy: false, limits: { maxCells: 4 } });
		expect(result).toMatchObject({
			ok: true,
			warnings: [{ code: 'DOCUMENT_VERSION_MIGRATED' }],
			document: {
				layers: [{ visible: true, opacity: 1, blendMode: 'normal', offsetX: 0, offsetY: 0, rotationZ: 0 }],
			},
		});
	});
});
