import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { decodeTextmodeDocument, parseJSON } from '../src/index.js';
import type { TextmodeV2AllDocumentJSON, TextmodeV2SelectedDocumentJSON } from '../src/index.js';

function selected(): TextmodeV2SelectedDocumentJSON {
	return JSON.parse(
		readFileSync(new URL('fixtures/v2/selected.json', import.meta.url), 'utf8')
	) as TextmodeV2SelectedDocumentJSON;
}

describe('resource limits and canonical output', () => {
	it('omits unknown fields without changing the caller input', () => {
		const input = selected();
		Object.assign(input, { futureHint: true });
		Object.assign(input.layer.cells.rows[0][0], { futureHint: true });
		const result = decodeTextmodeDocument(input);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.document).not.toHaveProperty('futureHint');
		expect(result.document.frames[0].layers[0].cells.rows[0][0]).not.toHaveProperty('futureHint');
		expect(input).toHaveProperty('futureHint', true);
	});

	it.each([
		'maxCells',
		'maxFrames',
		'maxLayers',
		'maxTotalLayers',
		'maxLayerIdLength',
		'maxCharacterLength',
		'maxMetadataStringLength',
	])('rejects invalid %s configuration', (name) => {
		for (const value of [0, -1, 1.5, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1]) {
			expect(() => decodeTextmodeDocument(selected(), { limits: { [name]: value } })).toThrow(TypeError);
		}
	});

	it('applies the layer budget before decoding stack contents', () => {
		const input = JSON.parse(
			readFileSync(new URL('fixtures/v2/all.json', import.meta.url), 'utf8')
		) as TextmodeV2AllDocumentJSON;
		expect(decodeTextmodeDocument(input, { limits: { maxLayers: 1 } })).toMatchObject({
			ok: false,
			error: { code: 'LIMIT_EXCEEDED', path: '$.layers' },
		});
		input.layers = [];
		expect(decodeTextmodeDocument(input)).toMatchObject({
			ok: false,
			error: { code: 'INVALID_DOCUMENT', path: '$.layers' },
		});
	});

	it('enforces identifier and metadata budgets', () => {
		expect(decodeTextmodeDocument(selected(), { limits: { maxLayerIdLength: 1 } })).toMatchObject({
			ok: false,
			error: { code: 'LIMIT_EXCEEDED', path: '$.layer.id' },
		});
		expect(decodeTextmodeDocument(selected(), { limits: { maxMetadataStringLength: 1 } })).toMatchObject({
			ok: false,
			error: { code: 'LIMIT_EXCEEDED' },
		});
	});

	it.each([0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])('rejects invalid grid dimensions %s', (cols) => {
		const input = selected();
		input.grid.cols = cols;
		expect(decodeTextmodeDocument(input)).toMatchObject({
			ok: false,
			error: { code: 'INVALID_DOCUMENT', path: '$.grid.cols' },
		});
	});

	it('rejects unsafe dimension products', () => {
		const input = selected();
		input.grid.cols = Number.MAX_SAFE_INTEGER;
		expect(decodeTextmodeDocument(input)).toMatchObject({ ok: false, error: { code: 'LIMIT_EXCEEDED' } });
	});

	it('preserves supported producer values and unrecognized blend-mode names', () => {
		const input = JSON.parse(
			readFileSync(new URL('fixtures/v2/all.json', import.meta.url), 'utf8')
		) as TextmodeV2AllDocumentJSON;
		input.layers[0].blendMode = 'custom-app-mode';
		input.layers[0].rotationZ = -450;
		const result = decodeTextmodeDocument(input);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.document.frames[0].layers[0]).toMatchObject({ blendMode: 'custom-app-mode', rotationZ: -450 });
	});

	it('does not claim duplicate-key detection in native JSON parsing', () => {
		expect(parseJSON('{"a":1,"a":2}')).toEqual({ ok: true, value: { a: 2 } });
	});
});
