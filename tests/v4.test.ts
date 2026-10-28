import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
	decodeTextmodeDocument,
	parseTextmodeDocumentJSON,
	type CanonicalTextmodeDocument,
	type TextmodeDocumentJSON,
	type TextmodeV3DocumentJSON,
	type TextmodeV31DocumentJSON,
} from '../src/index.js';
import { compileSchema } from './support/schema.js';

const validate = compileSchema('4.0');
function read<T>(name: string): T {
	return JSON.parse(readFileSync(new URL(`fixtures/${name}.json`, import.meta.url), 'utf8')) as T;
}
function fixture(name = 'still'): TextmodeDocumentJSON {
	return read(`v4/${name}`);
}
function canonical(input: unknown): CanonicalTextmodeDocument {
	const result = decodeTextmodeDocument(input);
	if (!result.ok) throw new Error(JSON.stringify(result.error));
	return result.document;
}

describe('v4 frame contract', () => {
	it.each(['still', 'variable-layers', 'blank'])('matches the fixed canonical oracle for %s', (name) => {
		const input = fixture(name);
		expect(validate(input), JSON.stringify(validate.errors)).toBe(true);
		const expected = read(`v4/expected/${name}`);
		expect(decodeTextmodeDocument(input)).toEqual({ ok: true, warnings: [], document: expected });
		expect(validate(expected), JSON.stringify(validate.errors)).toBe(true);
		expect(parseTextmodeDocumentJSON(JSON.stringify(expected))).toEqual({
			ok: true,
			warnings: [],
			document: expected,
		});
	});

	it('preserves timing, absence, reordering, fonts, grids, and presentation', () => {
		const document = canonical(fixture('variable-layers'));
		expect(document.frames.map((frame) => frame.durationMs)).toEqual([1000 / 60, 42.5, 5, 120]);
		expect(document.frames.map((frame) => frame.layers.map((layer) => layer.id))).toEqual([
			['base', 'accent'],
			['accent'],
			[],
			['accent', 'base'],
		]);
		expect(document.frames[0].layers[1]).toMatchObject({
			font: { id: `sfnt-v1-sha256:${'a'.repeat(64)}` },
			rotationZ: -450,
			grid: { cellWidth: 4 },
		});
		expect(document.frames[3].layers[1]).toMatchObject({
			font: { id: `sfnt-v1-sha256:${'b'.repeat(64)}` },
			grid: { cellHeight: 8 },
		});
		expect(document).not.toHaveProperty('layers');
	});

	it('copies every snapshot and strips unknown fields without changing input', () => {
		const input = fixture();
		input.frames.push(input.frames[0]);
		const layer = input.frames[0].layers[0];
		const cell = layer.cells.rows[0][0];
		for (const value of [input, input.frames[0], layer, layer.grid, layer.cells, cell, cell.transform])
			Object.assign(value, { extension: true });
		const before = structuredClone(input);
		const document = canonical(input);
		expect(JSON.stringify(document)).not.toContain('extension');
		expect(input).toEqual(before);
		document.frames[0].layers[0].cells.rows[0][0].foreground.r = 7;
		document.frames[0].layers[0].grid.cols = 7;
		expect(document.frames[1].layers[0].cells.rows[0][0].foreground.r).toBe(255);
		expect(document.frames[1].layers[0].grid.cols).toBe(1);
		expect(input).toEqual(before);
	});

	it.each(['layers', 'target', 'layer', 'grid', 'canvas'])('rejects reserved root %s', (key) => {
		const input = Object.assign(fixture(), { [key]: null });
		expect(validate(input)).toBe(false);
		expect(decodeTextmodeDocument(input)).toMatchObject({
			ok: false,
			error: { code: 'INVALID_DOCUMENT', path: `$.${key}` },
		});
	});

	it.each([undefined, null, 0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1])(
		'rejects invalid duration %s',
		(durationMs) => {
			const input = fixture();
			Object.assign(input.frames[0], { durationMs });
			expect(validate(input)).toBe(false);
			expect(decodeTextmodeDocument(input)).toMatchObject({
				ok: false,
				error: { code: 'INVALID_DOCUMENT', path: '$.frames[0].durationMs' },
			});
		}
	);

	it('checks cumulative duration at the safe numeric boundary', () => {
		const input = fixture('blank');
		input.frames[0].durationMs = Number.MAX_SAFE_INTEGER;
		expect(decodeTextmodeDocument(input).ok).toBe(true);
		input.frames.push({ durationMs: 0.5, layers: [] });
		expect(validate(input)).toBe(true);
		expect(decodeTextmodeDocument(input)).toMatchObject({
			ok: false,
			error: { code: 'LIMIT_EXCEEDED', path: '$.frames[1].durationMs' },
		});
	});

	it('does not lose small durations when the accumulated duration is large', () => {
		const input = fixture('blank');
		input.frames = [Number.MAX_SAFE_INTEGER - 1, 0.25, 0.25, 0.25, 0.25].map((durationMs) => ({
			durationMs,
			layers: [],
		}));
		expect(decodeTextmodeDocument(input).ok).toBe(true);
		input.frames.push({ durationMs: Number.MIN_VALUE, layers: [] });
		expect(decodeTextmodeDocument(input)).toMatchObject({
			ok: false,
			error: { code: 'LIMIT_EXCEEDED', path: '$.frames[5].durationMs' },
		});
	});

	it('accepts positive subnormal durations and exact binary fractions', () => {
		const input = fixture('blank');
		input.frames = [Number.MIN_VALUE, 0.125, 0.5, 1.5].map((durationMs) => ({ durationMs, layers: [] }));
		expect(canonical(input).frames.map((frame) => frame.durationMs)).toEqual([Number.MIN_VALUE, 0.125, 0.5, 1.5]);
	});

	it.each([undefined, null, [], {}])('requires a nonempty frames array: %j', (frames) => {
		const input = Object.assign(fixture(), { frames });
		expect(validate(input)).toBe(false);
		expect(decodeTextmodeDocument(input)).toMatchObject({ ok: false, error: { path: '$.frames' } });
	});

	it.each([undefined, null, {}])('requires a layers array even for blank frames: %j', (layers) => {
		const input = fixture();
		Object.assign(input.frames[0], { layers });
		expect(validate(input)).toBe(false);
		expect(decodeTextmodeDocument(input)).toMatchObject({ ok: false, error: { path: '$.frames[0].layers' } });
	});

	it('rejects duplicate IDs without repairing native v4', () => {
		const input = fixture();
		input.frames[0].layers.push(structuredClone(input.frames[0].layers[0]));
		expect(validate(input)).toBe(true); // Cross-field uniqueness belongs to the decoder.
		expect(decodeTextmodeDocument(input)).toMatchObject({
			ok: false,
			error: { code: 'INVALID_DOCUMENT', path: '$.frames[0].layers[1].id' },
		});
		expect(input.frames[0].layers.map((layer) => layer.id)).toEqual(['base', 'base']);
	});

	it('reports exact nested cell paths in later frames', () => {
		const input = fixture('variable-layers');
		input.frames[3].layers[1].cells.rows[0][0].x = 1;
		expect(decodeTextmodeDocument(input)).toMatchObject({
			ok: false,
			error: { path: '$.frames[3].layers[1].cells.rows[0][0]' },
		});
	});

	it('retains shared cell validation inside every frame', () => {
		const input = fixture('variable-layers');
		const layer = input.frames[3].layers[1];
		layer.cells.rows[0][0].character = '\ud800';
		expect(decodeTextmodeDocument(input)).toMatchObject({
			ok: false,
			error: { path: '$.frames[3].layers[1].cells.rows[0][0].character' },
		});
		layer.cells.rows[0][0].character = 'A';
		layer.grid.cols = 2;
		expect(decodeTextmodeDocument(input)).toMatchObject({
			ok: false,
			error: { path: '$.frames[3].layers[1].cells.rows[0]' },
		});
	});
});

describe('v4 cumulative budgets', () => {
	it('counts blank frames and checks the frame budget before their contents', () => {
		const input = fixture('blank');
		expect(decodeTextmodeDocument(input, { limits: { maxFrames: 1 } }).ok).toBe(true);
		input.frames.push({ durationMs: 100, layers: [] });
		Object.assign(input.frames[0], { layers: null });
		expect(decodeTextmodeDocument(input, { limits: { maxFrames: 1 } })).toMatchObject({
			ok: false,
			error: { code: 'LIMIT_EXCEEDED', path: '$.frames' },
		});
	});

	it('applies per-frame layers separately from total layers and cells', () => {
		const input = fixture();
		input.frames.push(structuredClone(input.frames[0]));
		expect(
			decodeTextmodeDocument(input, { limits: { maxFrames: 2, maxLayers: 1, maxTotalLayers: 2, maxCells: 2 } }).ok
		).toBe(true);
		expect(decodeTextmodeDocument(input, { limits: { maxTotalLayers: 1 } })).toMatchObject({
			ok: false,
			error: { code: 'LIMIT_EXCEEDED', path: '$.frames[1].layers' },
		});
		expect(decodeTextmodeDocument(input, { limits: { maxCells: 1 } })).toMatchObject({
			ok: false,
			error: { code: 'LIMIT_EXCEEDED', path: '$.frames[1].layers[0].cells.rows' },
		});
		expect(decodeTextmodeDocument(fixture('variable-layers'), { limits: { maxLayers: 1 } })).toMatchObject({
			ok: false,
			error: { code: 'LIMIT_EXCEEDED', path: '$.frames[0].layers' },
		});
	});

	it('preflights total layers in later frames before reading earlier cells', () => {
		const input = fixture();
		input.frames.push(structuredClone(input.frames[0]));
		Object.assign(input.frames[0].layers[0], { cells: null });
		expect(decodeTextmodeDocument(input, { limits: { maxTotalLayers: 1 } })).toMatchObject({
			ok: false,
			error: { code: 'LIMIT_EXCEEDED', path: '$.frames[1].layers' },
		});
	});
});

describe('historical migration to frames', () => {
	it.each(['legacy/selected-v1', 'legacy/all-v1.1', 'v2/selected', 'v2/all', 'v3/single-layer', 'v3/layer-stack'])(
		'wraps %s without changing its original input',
		(name) => {
			const input = read(name);
			const before = structuredClone(input);
			const document = canonical(input);
			expect(document.formatVersion).toBe('4.0.0');
			expect(document.frames).toHaveLength(1);
			expect(document.frames[0].durationMs).toBe(100);
			expect(validate(document), JSON.stringify(validate.errors)).toBe(true);
			expect(input).toEqual(before);
		}
	);

	it.each(['3.0.0', '3.1.0'] as const)('preserves version-specific font rules for %s', (formatVersion) => {
		const input: TextmodeV31DocumentJSON | TextmodeV3DocumentJSON = {
			...read<TextmodeV31DocumentJSON>('v3/single-layer'),
			formatVersion,
		};
		Object.assign(input.layers[0], { font: { id: `sfnt-v1-sha256:${'a'.repeat(64)}` } });
		const document = canonical(input);
		expect(document.frames[0].layers[0].font !== undefined).toBe(formatVersion === '3.1.0');
	});

	it.each(['legacy/all-v1.1', 'v2/all', 'v3/layer-stack'])(
		'reassigns duplicate IDs deterministically for %s',
		(name) => {
			const input = read<TextmodeV3DocumentJSON>(name);
			const layer = input.layers[0];
			input.layers = ['x', 'x', '1', 'x', '2'].map((id) => ({ ...structuredClone(layer), id }));
			const result = decodeTextmodeDocument(input);
			if (!result.ok) throw new Error(JSON.stringify(result.error));
			expect(result.document.frames[0].layers.map((layer) => layer.id)).toEqual(['x', '3', '1', '4', '2']);
			expect(result.warnings.slice(1)).toEqual([
				{
					code: 'LAYER_ID_REASSIGNED',
					path: '$.layers[1].id',
					message: 'Reassigned duplicate layer ID "x" to "3".',
				},
				{
					code: 'LAYER_ID_REASSIGNED',
					path: '$.layers[3].id',
					message: 'Reassigned duplicate layer ID "x" to "4".',
				},
			]);
			expect(decodeTextmodeDocument(input)).toEqual(result);
			expect(validate(result.document)).toBe(true);
		}
	);

	it('checks generated IDs against the configured length budget', () => {
		const input = read<TextmodeV3DocumentJSON>('v3/single-layer');
		const layer = input.layers[0];
		input.layers = ['x', 'x', ...Array.from({ length: 9 }, (_, i) => String(i + 1))].map((id) => ({
			...structuredClone(layer),
			id,
		}));
		expect(decodeTextmodeDocument(input, { limits: { maxLayerIdLength: 1 } })).toMatchObject({
			ok: false,
			error: { code: 'LIMIT_EXCEEDED', path: '$.layers[1].id' },
		});
	});

	it('applies total layer budgets to historical documents', () => {
		expect(decodeTextmodeDocument(read('v3/layer-stack'), { limits: { maxTotalLayers: 1 } })).toMatchObject({
			ok: false,
			error: { code: 'LIMIT_EXCEEDED', path: '$.layers' },
		});
	});
});
