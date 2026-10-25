import type {
	LEGACY_TEXTMODE_ALL_VERSION,
	LEGACY_TEXTMODE_LAYER_FORMAT,
	LEGACY_TEXTMODE_SELECTED_VERSION,
} from '../constants.js';
import type { TextmodeDocumentMetadata, TextmodeDocumentGrid } from './wire.js';
import type { TextmodeV2DocumentLayer, TextmodeV2SelectedDocumentLayer } from './v2.js';

export interface LegacyTextmodeSelectedDocumentJSON {
	$schema?: string;
	format: typeof LEGACY_TEXTMODE_LAYER_FORMAT;
	formatVersion: typeof LEGACY_TEXTMODE_SELECTED_VERSION;
	metadata?: TextmodeDocumentMetadata;
	canvas: { width: number; height: number };
	grid: TextmodeDocumentGrid;
	layer: TextmodeV2SelectedDocumentLayer;
}

export interface LegacyTextmodeAllDocumentJSON {
	$schema?: string;
	format: typeof LEGACY_TEXTMODE_LAYER_FORMAT;
	formatVersion: typeof LEGACY_TEXTMODE_ALL_VERSION;
	metadata?: TextmodeDocumentMetadata;
	canvas: { width: number; height: number };
	layers: TextmodeV2DocumentLayer[];
}
