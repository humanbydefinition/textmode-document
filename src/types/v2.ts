import type {
	TextmodeDocumentFormat,
	TextmodeDocumentMetadata,
	TextmodeDocumentGrid,
	TextmodeDocumentCellCollection,
	TextmodeDocumentLayer,
} from './wire.js';

/**
 * Selected-layer payload in the historical v2 wire format.
 *
 * @category Historical formats
 */
export interface TextmodeV2SelectedDocumentLayer {
	/** Document-local layer ID. */
	id: string;
	/** Dense row-major cell data. */
	cells: TextmodeDocumentCellCollection;
}

/**
 * Layer fields required by the v2 wire format and validated during migration.
 *
 * @category Historical formats
 */
export interface TextmodeV2DocumentLayer extends TextmodeDocumentLayer {
	/** Horizontal pixel offset. */
	offsetX: number;
	/** Vertical pixel offset. */
	offsetY: number;
	/** Layer rotation in degrees. */
	rotationZ: number;
}

/**
 * Historical v2 selected-layer wire document.
 *
 * @category Historical formats
 */
export interface TextmodeV2SelectedDocumentJSON {
	/** Format discriminator. */
	format: TextmodeDocumentFormat;
	/** Historical wire format version. */
	formatVersion: '2.0.0';
	/** Shape discriminator for the selected layer or layer stack. */
	target: 'selected';
	/** Optional producer metadata. */
	metadata?: TextmodeDocumentMetadata;
	/** Historical canvas pixel dimensions. */
	canvas: {
		/** Canvas width in pixels. */
		width: number;
		/** Canvas height in pixels. */
		height: number;
	};
	/** Grid dimensions for the selected layer. */
	grid: TextmodeDocumentGrid;
	/** Selected layer data. */
	layer: TextmodeV2SelectedDocumentLayer;
}

/**
 * Historical v2 layer-stack wire document.
 *
 * @category Historical formats
 */
export interface TextmodeV2AllDocumentJSON {
	/** Format discriminator. */
	format: TextmodeDocumentFormat;
	/** Historical wire format version. */
	formatVersion: '2.0.0';
	/** Shape discriminator for the selected layer or layer stack. */
	target: 'all';
	/** Optional producer metadata. */
	metadata?: TextmodeDocumentMetadata;
	/** Historical canvas pixel dimensions. */
	canvas: {
		/** Canvas width in pixels. */
		width: number;
		/** Canvas height in pixels. */
		height: number;
	};
	/** Layer snapshots in bottom-first order. */
	layers: TextmodeV2DocumentLayer[];
}
