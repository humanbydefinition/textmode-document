import type {
	LEGACY_TEXTMODE_ALL_VERSION,
	LEGACY_TEXTMODE_LAYER_FORMAT,
	LEGACY_TEXTMODE_SELECTED_VERSION,
} from '../constants.js';
import type { TextmodeDocumentMetadata, TextmodeDocumentGrid } from './wire.js';
import type { TextmodeV2DocumentLayer, TextmodeV2SelectedDocumentLayer } from './v2.js';

/** Legacy v1.0 selected-layer wire document. */
export interface LegacyTextmodeSelectedDocumentJSON {
	/** Optional JSON Schema identifier. */
	$schema?: string;
	/** Format discriminator. */
	format: typeof LEGACY_TEXTMODE_LAYER_FORMAT;
	/** Historical wire format version. */
	formatVersion: typeof LEGACY_TEXTMODE_SELECTED_VERSION;
	/** Optional producer metadata. */
	metadata?: TextmodeDocumentMetadata;
	/** Historical canvas pixel dimensions. */
	canvas: { width: number; height: number };
	/** Grid dimensions for the selected layer. */
	grid: TextmodeDocumentGrid;
	/** Selected layer data. */
	layer: TextmodeV2SelectedDocumentLayer;
}

/** Legacy v1.1 layer-stack wire document. */
export interface LegacyTextmodeAllDocumentJSON {
	/** Optional JSON Schema identifier. */
	$schema?: string;
	/** Format discriminator. */
	format: typeof LEGACY_TEXTMODE_LAYER_FORMAT;
	/** Historical wire format version. */
	formatVersion: typeof LEGACY_TEXTMODE_ALL_VERSION;
	/** Optional producer metadata. */
	metadata?: TextmodeDocumentMetadata;
	/** Historical canvas pixel dimensions. */
	canvas: { width: number; height: number };
	/** Layer snapshots in bottom-first order. */
	layers: TextmodeV2DocumentLayer[];
}
