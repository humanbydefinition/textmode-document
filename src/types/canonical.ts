import type {
	TextmodeDocumentCell,
	TextmodeDocumentRGBAColor,
	TextmodeDocumentCellTransform,
	TextmodeSelectedDocumentJSON,
	TextmodeDocumentLayer,
	TextmodeAllDocumentJSON,
} from './wire.js';
import type { TEXTMODE_OBJECT_ROWS_ENCODING } from '../constants.js';

export interface CanonicalTextmodeCell extends Omit<TextmodeDocumentCell, 'foreground' | 'background' | 'transform'> {
	foreground: TextmodeDocumentRGBAColor;
	background: TextmodeDocumentRGBAColor;
	transform: TextmodeDocumentCellTransform;
}

export interface CanonicalTextmodeCellCollection {
	encoding: typeof TEXTMODE_OBJECT_ROWS_ENCODING;
	rows: CanonicalTextmodeCell[][];
}

export interface CanonicalTextmodeSelectedDocument extends Omit<TextmodeSelectedDocumentJSON, 'layer'> {
	layer: {
		id: string;
		cells: CanonicalTextmodeCellCollection;
	};
}

export interface CanonicalTextmodeDocumentLayer extends Omit<TextmodeDocumentLayer, 'cells'> {
	cells: CanonicalTextmodeCellCollection;
}

export interface CanonicalTextmodeAllDocument extends Omit<TextmodeAllDocumentJSON, 'layers'> {
	layers: CanonicalTextmodeDocumentLayer[];
}

export type CanonicalTextmodeDocument = CanonicalTextmodeSelectedDocument | CanonicalTextmodeAllDocument;
