import type {
	TEXTMODE_DOCUMENT_FORMAT,
	TEXTMODE_DOCUMENT_FORMAT_VERSION,
	TEXTMODE_OBJECT_ROWS_ENCODING,
} from '../constants.js';

/**
 * Scope encoded by a textmode document.
 *
 * @category JSON document data
 */
export type TextmodeDocumentTarget = 'selected' | 'all';
/** Format discriminator encoded in a document. */
export type TextmodeDocumentFormat = typeof TEXTMODE_DOCUMENT_FORMAT;
/** Current on-disk format version, independent of the npm package version. */
export type TextmodeDocumentVersion = typeof TEXTMODE_DOCUMENT_FORMAT_VERSION;

/** RGBA color channels, each an integer from 0 through 255. */
export interface TextmodeDocumentRGBAColor {
	r: number;
	g: number;
	b: number;
	a: number;
}

/** On-disk color notation; decoded colors use RGBA channels. */
export type TextmodeDocumentColor = string | TextmodeDocumentRGBAColor;

/** Per-cell transform in degrees. */
export interface TextmodeDocumentCellTransform {
	invert: boolean;
	flipX: boolean;
	flipY: boolean;
	rotation: number;
}

/** Cell at its redundant row-major x/y coordinates. */
export interface TextmodeDocumentCell {
	x: number;
	y: number;
	character: string;
	foreground: TextmodeDocumentColor;
	background: TextmodeDocumentColor;
	transform: TextmodeDocumentCellTransform;
}

/** Dense row-major cell collection. */
export interface TextmodeDocumentCellCollection {
	encoding: typeof TEXTMODE_OBJECT_ROWS_ENCODING;
	rows: TextmodeDocumentCell[][];
}

/** Logical grid dimensions and pixel extent of each cell. */
export interface TextmodeDocumentGrid {
	cols: number;
	rows: number;
	cellWidth: number;
	cellHeight: number;
}

/** Optional producer information; it does not control decoding behavior. */
export interface TextmodeDocumentMetadata {
	createdAt: string;
	generator: {
		name: string;
		version: string;
	};
}

export interface TextmodeSelectedDocumentLayer {
	id: string;
	cells: TextmodeDocumentCellCollection;
}

export interface TextmodeSelectedDocumentJSON {
	format: TextmodeDocumentFormat;
	formatVersion: TextmodeDocumentVersion;
	target: 'selected';
	metadata?: TextmodeDocumentMetadata;
	canvas: {
		width: number;
		height: number;
	};
	grid: TextmodeDocumentGrid;
	layer: TextmodeSelectedDocumentLayer;
}

export interface TextmodeDocumentLayer {
	id: string;
	visible: boolean;
	opacity: number;
	blendMode: string;
	offsetX: number;
	offsetY: number;
	rotationZ: number;
	grid: TextmodeDocumentGrid;
	cells: TextmodeDocumentCellCollection;
}

export interface TextmodeAllDocumentJSON {
	format: TextmodeDocumentFormat;
	formatVersion: TextmodeDocumentVersion;
	target: 'all';
	metadata?: TextmodeDocumentMetadata;
	canvas: {
		width: number;
		height: number;
	};
	layers: TextmodeDocumentLayer[];
}

/**
 * JSON document produced by the selected-layer or layer-stack exporter.
 *
 * @category JSON document data
 */
export type TextmodeDocumentJSON = TextmodeSelectedDocumentJSON | TextmodeAllDocumentJSON;
