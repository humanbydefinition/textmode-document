import type {
	TextmodeDocumentFormat,
	TextmodeDocumentMetadata,
	TextmodeDocumentGrid,
	TextmodeDocumentCellCollection,
	TextmodeDocumentLayer,
} from './wire.js';

export interface TextmodeV2SelectedDocumentLayer {
	id: string;
	cells: TextmodeDocumentCellCollection;
}

/** Layer fields required by the v2 wire format and validated during migration. */
export interface TextmodeV2DocumentLayer extends TextmodeDocumentLayer {
	offsetX: number;
	offsetY: number;
	rotationZ: number;
}

export interface TextmodeV2SelectedDocumentJSON {
	format: TextmodeDocumentFormat;
	formatVersion: '2.0.0';
	target: 'selected';
	metadata?: TextmodeDocumentMetadata;
	canvas: {
		width: number;
		height: number;
	};
	grid: TextmodeDocumentGrid;
	layer: TextmodeV2SelectedDocumentLayer;
}

export interface TextmodeV2AllDocumentJSON {
	format: TextmodeDocumentFormat;
	formatVersion: '2.0.0';
	target: 'all';
	metadata?: TextmodeDocumentMetadata;
	canvas: {
		width: number;
		height: number;
	};
	layers: TextmodeV2DocumentLayer[];
}
