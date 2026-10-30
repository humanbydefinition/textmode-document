import type { TextmodeDocumentFormat, TextmodeDocumentLayer, TextmodeDocumentMetadata } from './wire.js';

/** Historical v3.0 layer. Font references were not part of this version. */
export type TextmodeV3DocumentLayer = Omit<TextmodeDocumentLayer, 'font'>;

/** Historical v3.0 wire document; decoding returns canonical v4 frames. */
export interface TextmodeV3DocumentJSON {
	/** Format discriminator. */
	format: TextmodeDocumentFormat;
	/** Historical wire format version. */
	formatVersion: '3.0.0';
	/** Optional producer metadata. */
	metadata?: TextmodeDocumentMetadata;
	/** Layer snapshots in bottom-first order. */
	layers: TextmodeV3DocumentLayer[];
}

/** Historical v3.1 wire document with optional font references. */
export interface TextmodeV31DocumentJSON extends Omit<TextmodeV3DocumentJSON, 'formatVersion' | 'layers'> {
	/** Historical wire format version. */
	formatVersion: '3.1.0';
	/** Layer snapshots in bottom-first order. */
	layers: TextmodeDocumentLayer[];
}
