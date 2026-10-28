import { TEXTMODE_OBJECT_ROWS_ENCODING } from './constants.js';
import {
	assertCanvasMatchesGrid,
	checkedProduct,
	decodeCanvas,
	decodeColor,
	decodeGrid,
	decodeLayerId,
	fail,
	normalizeRotation,
	requireArray,
	requireBoolean,
	requireBoundedString,
	requireCharacter,
	requireFiniteNumber,
	requireNumberInRange,
	requireRecord,
	requireSafeInteger,
	requireString,
} from './validation.js';
import type { DecodeContext, UnknownRecord } from './validation.js';
import type {
	CanonicalTextmodeDocumentFrame,
	CanonicalTextmodeCell,
	CanonicalTextmodeCellCollection,
	CanonicalTextmodeDocumentLayer,
	TextmodeDocumentGrid,
	TextmodeDocumentFontReference,
} from './types/index.js';

/** Validate the historical selected-layer shape before migration. */
export function decodeSelectedDocument(root: UnknownRecord, context: DecodeContext): CanonicalTextmodeDocumentLayer[] {
	const canvas = decodeCanvas(root.canvas, '$.canvas');
	const grid = decodeGrid(root.grid, '$.grid');
	assertCanvasMatchesGrid(canvas, grid, '$.canvas');
	const layer = requireRecord(root.layer, '$.layer');
	checkLayerCount(1, '$.layer', context);
	return [
		{
			visible: true,
			opacity: 1,
			blendMode: 'normal',
			offsetX: 0,
			offsetY: 0,
			rotationZ: 0,
			grid,
			id: decodeLayerId(layer.id, '$.layer.id', context.limits),
			cells: decodeCells(layer.cells, grid, '$.layer.cells', context),
		},
	];
}

/** Validate the historical layer-stack shape before migration. */
export function decodeAllDocument(root: UnknownRecord, context: DecodeContext): CanonicalTextmodeDocumentLayer[] {
	const canvas = decodeCanvas(root.canvas, '$.canvas');
	const values = requireArray(root.layers, '$.layers');
	if (values.length === 0)
		fail('INVALID_DOCUMENT', 'A layer-stack document must contain at least one layer.', '$.layers');
	checkLayerCount(values.length, '$.layers', context);
	const layers = values.map((value, index) => decodeLayer(value, `$.layers[${index}]`, context, false));
	assertCanvasMatchesGrid(canvas, layers[0].grid, '$.canvas');
	return layers;
}

function checkLayerCount(count: number, path: string, context: DecodeContext): void {
	if (count > context.limits.maxLayers)
		fail('LIMIT_EXCEEDED', `Layer count exceeds the configured limit ${context.limits.maxLayers}.`, path);
	if (count > context.limits.maxTotalLayers)
		fail(
			'LIMIT_EXCEEDED',
			`Total layer count exceeds the configured limit ${context.limits.maxTotalLayers}.`,
			path
		);
}

function decodeLayer(
	value: unknown,
	path: string,
	context: DecodeContext,
	validatePixelExtent: boolean,
	includeFont = false
): CanonicalTextmodeDocumentLayer {
	const layer = requireRecord(value, path);
	const grid = decodeGrid(layer.grid, `${path}.grid`);
	if (validatePixelExtent) {
		checkedProduct(grid.cols, grid.cellWidth, `${path}.grid.cellWidth`);
		checkedProduct(grid.rows, grid.cellHeight, `${path}.grid.cellHeight`);
	}

	return {
		id: decodeLayerId(layer.id, `${path}.id`, context.limits),
		...(includeFont && layer.font !== undefined ? { font: decodeFont(layer.font, `${path}.font`, context) } : {}),
		visible: requireBoolean(layer.visible, `${path}.visible`),
		opacity: requireNumberInRange(layer.opacity, `${path}.opacity`, 0, 1),
		blendMode: requireBoundedString(layer.blendMode, `${path}.blendMode`, context.limits.maxMetadataStringLength),
		offsetX: requireFiniteNumber(layer.offsetX, `${path}.offsetX`),
		offsetY: requireFiniteNumber(layer.offsetY, `${path}.offsetY`),
		rotationZ: requireFiniteNumber(layer.rotationZ, `${path}.rotationZ`),
		grid,
		cells: decodeCells(layer.cells, grid, `${path}.cells`, context),
	};
}

function decodeCells(
	value: unknown,
	grid: TextmodeDocumentGrid,
	path: string,
	context: DecodeContext
): CanonicalTextmodeCellCollection {
	const collection = requireRecord(value, path);
	const encoding = requireString(collection.encoding, `${path}.encoding`);
	if (encoding !== TEXTMODE_OBJECT_ROWS_ENCODING) {
		fail('UNSUPPORTED_ENCODING', `Unsupported cell encoding: ${encoding}.`, `${path}.encoding`);
	}

	const expectedCellCount = checkedProduct(grid.cols, grid.rows, `${path}.rows`);
	if (expectedCellCount > context.remainingCells) {
		fail(
			'LIMIT_EXCEEDED',
			`Document cell count exceeds the configured limit ${context.limits.maxCells}.`,
			`${path}.rows`
		);
	}
	context.remainingCells -= expectedCellCount;

	const rows = requireArray(collection.rows, `${path}.rows`);
	if (rows.length !== grid.rows) {
		fail('INVALID_DOCUMENT', `Expected ${grid.rows} cell rows, received ${rows.length}.`, `${path}.rows`);
	}

	return {
		encoding: TEXTMODE_OBJECT_ROWS_ENCODING,
		rows: rows.map((rowValue, y) => {
			const rowPath = `${path}.rows[${y}]`;
			const row = requireArray(rowValue, rowPath);
			if (row.length !== grid.cols) {
				fail('INVALID_DOCUMENT', `Expected ${grid.cols} cells, received ${row.length}.`, rowPath);
			}
			return row.map((cell, x) => decodeCell(cell, x, y, `${rowPath}[${x}]`, context));
		}),
	};
}

function decodeCell(
	value: unknown,
	expectedX: number,
	expectedY: number,
	path: string,
	context: DecodeContext
): CanonicalTextmodeCell {
	const cell = requireRecord(value, path);
	const x = requireSafeInteger(cell.x, `${path}.x`);
	const y = requireSafeInteger(cell.y, `${path}.y`);
	if (x !== expectedX || y !== expectedY) {
		fail('INVALID_DOCUMENT', `Cell coordinates must match their row position (${expectedX}, ${expectedY}).`, path);
	}

	const transform = requireRecord(cell.transform, `${path}.transform`);
	return {
		x,
		y,
		character: requireCharacter(cell.character, `${path}.character`, context.limits),
		foreground: decodeColor(cell.foreground, `${path}.foreground`),
		background: decodeColor(cell.background, `${path}.background`),
		transform: {
			invert: requireBoolean(transform.invert, `${path}.transform.invert`),
			flipX: requireBoolean(transform.flipX, `${path}.transform.flipX`),
			flipY: requireBoolean(transform.flipY, `${path}.transform.flipY`),
			rotation: normalizeRotation(requireFiniteNumber(transform.rotation, `${path}.transform.rotation`)),
		},
	};
}

/** Validate v3 using its original root and font rules. */
export function decodeV3Document(root: UnknownRecord, context: DecodeContext): CanonicalTextmodeDocumentLayer[] {
	rejectRootFields(root, ['target', 'layer', 'grid', 'canvas']);
	const values = requireArray(root.layers, '$.layers');
	if (values.length === 0) fail('INVALID_DOCUMENT', 'A document must contain at least one layer.', '$.layers');
	checkLayerCount(values.length, '$.layers', context);
	return values.map((value, index) =>
		decodeLayer(value, `$.layers[${index}]`, context, true, root.formatVersion === '3.1.0')
	);
}

function rejectRootFields(root: UnknownRecord, keys: string[]): void {
	for (const key of keys) {
		if (Object.prototype.hasOwnProperty.call(root, key))
			fail('INVALID_DOCUMENT', `Obsolete root field: ${key}.`, `$.${key}`);
	}
}

/** Preflight all frame and layer counts before decoding any cell payload. */
export function decodeV4Frames(root: UnknownRecord, context: DecodeContext): CanonicalTextmodeDocumentFrame[] {
	rejectRootFields(root, ['layers', 'target', 'layer', 'grid', 'canvas']);
	const values = requireArray(root.frames, '$.frames');
	if (values.length === 0) fail('INVALID_DOCUMENT', 'A document must contain at least one frame.', '$.frames');
	if (values.length > context.limits.maxFrames)
		fail('LIMIT_EXCEEDED', `Frame count exceeds the configured limit ${context.limits.maxFrames}.`, '$.frames');

	let totalLayers = 0;
	let durationUnits = 0n;
	const maxDurationUnits = BigInt(Number.MAX_SAFE_INTEGER) << 1074n;
	const durationView = new DataView(new ArrayBuffer(8));
	const frames = values.map((value, index) => {
		const path = `$.frames[${index}]`;
		const frame = requireRecord(value, path);
		const durationMs = requireFiniteNumber(frame.durationMs, `${path}.durationMs`);
		if (durationMs <= 0 || durationMs > Number.MAX_SAFE_INTEGER)
			fail(
				'INVALID_DOCUMENT',
				'Frame duration must be positive and at most Number.MAX_SAFE_INTEGER milliseconds.',
				`${path}.durationMs`
			);
		durationUnits += durationInUnits(durationMs, durationView);
		if (durationUnits > maxDurationUnits)
			fail('LIMIT_EXCEEDED', 'Cumulative frame duration exceeds the safe numeric range.', `${path}.durationMs`);
		const layers = requireArray(frame.layers, `${path}.layers`);
		checkLayerCount(layers.length, `${path}.layers`, context);
		if (layers.length > context.limits.maxTotalLayers - totalLayers)
			fail(
				'LIMIT_EXCEEDED',
				`Total layer count exceeds the configured limit ${context.limits.maxTotalLayers}.`,
				`${path}.layers`
			);
		totalLayers += layers.length;
		const ids = new Set<string>();
		layers.forEach((value, layerIndex) => {
			const idPath = `${path}.layers[${layerIndex}].id`;
			const layer = requireRecord(value, `${path}.layers[${layerIndex}]`);
			const id = decodeLayerId(layer.id, idPath, context.limits);
			if (ids.has(id)) fail('INVALID_DOCUMENT', 'Layer IDs must be unique within a frame.', idPath);
			ids.add(id);
		});
		return { durationMs, layers, path };
	});
	return frames.map(({ durationMs, layers, path }) => ({
		durationMs,
		layers: layers.map((value, index) => decodeLayer(value, `${path}.layers[${index}]`, context, true, true)),
	}));
}

/** Sum parsed binary64 values exactly in units of the smallest positive number (2^-1074). */
function durationInUnits(value: number, view: DataView): bigint {
	view.setFloat64(0, value);
	const high = view.getUint32(0);
	const exponent = (high >>> 20) & 0x7ff;
	const fraction = (BigInt(high & 0xfffff) << 32n) | BigInt(view.getUint32(4));
	return exponent === 0 ? fraction : ((1n << 52n) | fraction) << BigInt(exponent - 1);
}

function decodeFont(value: unknown, path: string, context: DecodeContext): TextmodeDocumentFontReference {
	const font = requireRecord(value, path);
	const id = requireString(font.id, `${path}.id`);
	if (!/^sfnt-v1-sha256:[0-9a-f]{64}$/.test(id))
		fail('INVALID_DOCUMENT', 'Expected a complete sfnt-v1-sha256 font identity.', `${path}.id`);
	return {
		id: id as TextmodeDocumentFontReference['id'],
		...(font.name === undefined
			? {}
			: { name: requireBoundedString(font.name, `${path}.name`, context.limits.maxMetadataStringLength) }),
	};
}
