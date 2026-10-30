import type {
	TextmodeDocumentCell,
	TextmodeDocumentRGBAColor,
	TextmodeDocumentLayer,
	TextmodeDocumentJSON,
	TextmodeDocumentFrame,
} from './wire.js';
import type { TEXTMODE_OBJECT_ROWS_ENCODING } from '../constants.js';

/** Decoded cell with RGBA colors and normalized cell rotation. */
export interface CanonicalTextmodeCell extends Omit<TextmodeDocumentCell, 'foreground' | 'background'> {
	/** Decoded glyph color. */
	foreground: TextmodeDocumentRGBAColor;
	/** Decoded background color. */
	background: TextmodeDocumentRGBAColor;
}
/** Dense collection of decoded cells. */
export interface CanonicalTextmodeCellCollection {
	/** Dense object-row encoding discriminator. */
	encoding: typeof TEXTMODE_OBJECT_ROWS_ENCODING;
	/** Decoded cells in row-major order. */
	rows: CanonicalTextmodeCell[][];
}
/** Decoded layer with canonical cells. */
export interface CanonicalTextmodeDocumentLayer extends Omit<TextmodeDocumentLayer, 'cells'> {
	/** Decoded dense cell collection. */
	cells: CanonicalTextmodeCellCollection;
}
/** Decoded complete frame snapshot. */
export interface CanonicalTextmodeDocumentFrame extends Omit<TextmodeDocumentFrame, 'layers'> {
	/** Decoded layers in bottom-first order. */
	layers: CanonicalTextmodeDocumentLayer[];
}
/** Canonical v4 document returned by the decoder, including migrated input. */
export interface CanonicalTextmodeDocument extends Omit<TextmodeDocumentJSON, 'frames'> {
	/** Decoded frames in playback order. */
	frames: CanonicalTextmodeDocumentFrame[];
}
