/**
 * Dependency-free textmode document protocol codec.
 *
 * This entry point contains no DOM, renderer, textmode.js, or media encoder
 * dependencies. It decodes v4 frames and migrates supported v1/v2/v3 documents; product-specific
 * import policy belongs to callers.
 *
 * @packageDocumentation
 */

export {
	DEFAULT_TEXTMODE_DOCUMENT_LIMITS,
	LEGACY_TEXTMODE_ALL_VERSION,
	LEGACY_TEXTMODE_LAYER_FORMAT,
	LEGACY_TEXTMODE_SELECTED_VERSION,
	TEXTMODE_DOCUMENT_FORMAT,
	TEXTMODE_DOCUMENT_FORMAT_VERSION,
	TEXTMODE_OBJECT_ROWS_ENCODING,
} from './constants.js';
export { decodeTextmodeDocument, parseTextmodeDocumentJSON } from './decode.js';
export { parseJSON } from './parse.js';
export type {
	CanonicalTextmodeCell,
	CanonicalTextmodeCellCollection,
	CanonicalTextmodeDocument,
	CanonicalTextmodeDocumentLayer,
	CanonicalTextmodeDocumentFrame,
	TextmodeDocumentFrame,
	TextmodeV3DocumentJSON,
	TextmodeV31DocumentJSON,
	TextmodeV3DocumentLayer,
	JSONParseResult,
	TextmodeV2SelectedDocumentLayer,
	TextmodeV2SelectedDocumentJSON,
	TextmodeV2AllDocumentJSON,
	TextmodeV2DocumentLayer,
	LegacyTextmodeAllDocumentJSON,
	LegacyTextmodeSelectedDocumentJSON,
	TextmodeDocumentDecodeOptions,
	TextmodeDocumentDecodeResult,
	TextmodeDocumentCell,
	TextmodeDocumentCellCollection,
	TextmodeDocumentCellTransform,
	TextmodeDocumentColor,
	TextmodeDocumentError,
	TextmodeDocumentErrorCode,
	TextmodeDocumentFormat,
	TextmodeDocumentFontReference,
	TextmodeDocumentGrid,
	TextmodeDocumentJSON,
	TextmodeDocumentLayer,
	TextmodeDocumentLimits,
	TextmodeDocumentMetadata,
	TextmodeDocumentParseResult,
	TextmodeDocumentRGBAColor,
	TextmodeDocumentVersion,
	TextmodeDocumentWarning,
} from './types/index.js';
