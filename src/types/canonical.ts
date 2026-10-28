import type {
	TextmodeDocumentCell,
	TextmodeDocumentRGBAColor,
	TextmodeDocumentLayer,
	TextmodeDocumentJSON,
	TextmodeDocumentFrame,
} from './wire.js';
import type { TEXTMODE_OBJECT_ROWS_ENCODING } from '../constants.js';

export interface CanonicalTextmodeCell extends Omit<TextmodeDocumentCell, 'foreground' | 'background'> {
	foreground: TextmodeDocumentRGBAColor;
	background: TextmodeDocumentRGBAColor;
}
export interface CanonicalTextmodeCellCollection {
	encoding: typeof TEXTMODE_OBJECT_ROWS_ENCODING;
	rows: CanonicalTextmodeCell[][];
}
export interface CanonicalTextmodeDocumentLayer extends Omit<TextmodeDocumentLayer, 'cells'> {
	cells: CanonicalTextmodeCellCollection;
}
export interface CanonicalTextmodeDocumentFrame extends Omit<TextmodeDocumentFrame, 'layers'> {
	layers: CanonicalTextmodeDocumentLayer[];
}
export interface CanonicalTextmodeDocument extends Omit<TextmodeDocumentJSON, 'frames'> {
	frames: CanonicalTextmodeDocumentFrame[];
}
