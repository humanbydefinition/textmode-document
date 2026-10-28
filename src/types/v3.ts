import type { TextmodeDocumentFormat, TextmodeDocumentLayer, TextmodeDocumentMetadata } from './wire.js';

/** Historical v3.0 layer. Font references were not part of this version. */
export type TextmodeV3DocumentLayer = Omit<TextmodeDocumentLayer, 'font'>;

/** Historical v3.0 wire document; decoding returns canonical v4 frames. */
export interface TextmodeV3DocumentJSON {
	format: TextmodeDocumentFormat;
	formatVersion: '3.0.0';
	metadata?: TextmodeDocumentMetadata;
	layers: TextmodeV3DocumentLayer[];
}

/** Historical v3.1 wire document with optional font references. */
export interface TextmodeV31DocumentJSON extends Omit<TextmodeV3DocumentJSON, 'formatVersion' | 'layers'> {
	formatVersion: '3.1.0';
	layers: TextmodeDocumentLayer[];
}
