import type {
	TEXTMODE_DOCUMENT_FORMAT,
	TEXTMODE_DOCUMENT_FORMAT_VERSION,
	TEXTMODE_OBJECT_ROWS_ENCODING,
} from '../constants.js';

/** Format discriminator encoded in a document. */
export type TextmodeDocumentFormat = typeof TEXTMODE_DOCUMENT_FORMAT;
/** Current on-disk format version, independent of the npm package version. */
export type TextmodeDocumentVersion = typeof TEXTMODE_DOCUMENT_FORMAT_VERSION;

/** RGBA color channels, each an integer from 0 through 255. */
export interface TextmodeDocumentRGBAColor {
	/** Red channel, from 0 through 255. */
	r: number;
	/** Green channel, from 0 through 255. */
	g: number;
	/** Blue channel, from 0 through 255. */
	b: number;
	/** Alpha channel, from 0 through 255. */
	a: number;
}

/** On-disk color as `#RRGGBB`, `#RRGGBBAA`, or RGBA channels. Decoding produces RGBA channels. */
export type TextmodeDocumentColor = string | TextmodeDocumentRGBAColor;

/** Per-cell transform in degrees. */
export interface TextmodeDocumentCellTransform {
	/** Whether to swap foreground and background colors. */
	invert: boolean;
	/** Whether to flip the glyph horizontally. */
	flipX: boolean;
	/** Whether to flip the glyph vertically. */
	flipY: boolean;
	/** Glyph rotation in degrees; decoding normalizes it to [0, 360). */
	rotation: number;
}

/** Cell at its redundant row-major x/y coordinates. */
export interface TextmodeDocumentCell {
	/** Zero-based column, matching the cell position in its row. */
	x: number;
	/** Zero-based row, matching the cell position in the collection. */
	y: number;
	/** Nonempty, well-formed Unicode glyph string. It can contain multiple scalar values. */
	character: string;
	/** Glyph color. */
	foreground: TextmodeDocumentColor;
	/** Cell background color. */
	background: TextmodeDocumentColor;
	/** Glyph and color transforms. */
	transform: TextmodeDocumentCellTransform;
}

/** Dense row-major cell collection. */
export interface TextmodeDocumentCellCollection {
	/** Encoding discriminator for dense object rows. */
	encoding: typeof TEXTMODE_OBJECT_ROWS_ENCODING;
	/** Rows in top-to-bottom order, each containing cells from left to right. */
	rows: TextmodeDocumentCell[][];
}

/** Logical grid dimensions and pixel extent of each cell. */
export interface TextmodeDocumentGrid {
	/** Number of columns, as a positive safe integer. */
	cols: number;
	/** Number of rows, as a positive safe integer. */
	rows: number;
	/** Cell width in pixels, as a positive safe integer. */
	cellWidth: number;
	/** Cell height in pixels, as a positive safe integer. */
	cellHeight: number;
}

/** Optional producer information; it does not control decoding behavior. */
export interface TextmodeDocumentMetadata {
	/** Uppercase RFC 3339 timestamp with seconds and a timezone. */
	createdAt: string;
	/** Producer name and version. */
	generator: {
		/** Producer name. */
		name: string;
		/** Producer version. */
		version: string;
	};
}

/** Portable identity of a normalized font revision. Matching uses only id. */
export interface TextmodeDocumentFontReference {
	/** Complete normalized SFNT identity, including a lowercase SHA-256 digest. */
	id: `sfnt-v1-sha256:${string}`;
	/** Optional display name; do not use it for identity matching. */
	name?: string;
}

/** Complete layer snapshot with presentation, grid, and cell data. */
export interface TextmodeDocumentLayer {
	/** Optional source-font identity; the font bytes are not embedded. */
	font?: TextmodeDocumentFontReference;
	/** Nonempty ID, unique within a frame and reusable across frames. */
	id: string;
	/** Whether the layer is visible; hidden cells remain stored. */
	visible: boolean;
	/** Layer opacity from 0 through 1, independent of cell alpha. */
	opacity: number;
	/** Nonempty blend mode name; consumers decide which names they support. */
	blendMode: string;
	/** Horizontal pixel offset; positive values move right in textmode.js. */
	offsetX: number;
	/** Vertical pixel offset; positive values move down in textmode.js. */
	offsetY: number;
	/** Layer rotation in degrees, preserved without normalization. */
	rotationZ: number;
	/** Dimensions of the layer cell grid. */
	grid: TextmodeDocumentGrid;
	/** Complete dense cell data for the grid. */
	cells: TextmodeDocumentCellCollection;
}

/** Complete snapshot. Layers are bottom first; an empty stack is a blank frame. */
export interface TextmodeDocumentFrame {
	/** Positive finite milliseconds, including fractional milliseconds. */
	durationMs: number;
	/** Complete layer snapshots, bottom first. An empty array represents a blank frame. */
	layers: TextmodeDocumentLayer[];
}

/** One portable document with one or more frames in playback order. */
export interface TextmodeDocumentJSON {
	/** Document format discriminator. */
	format: TextmodeDocumentFormat;
	/** Wire format version, independent of the package version. */
	formatVersion: TextmodeDocumentVersion;
	/** Optional producer metadata. */
	metadata?: TextmodeDocumentMetadata;
	/** Nonempty sequence of complete snapshots in playback order. */
	frames: TextmodeDocumentFrame[];
}
