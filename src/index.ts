/**
 * Dependency-free textmode document protocol codec.
 *
 * This entry point contains no DOM, renderer, textmode.js, or media encoder
 * dependencies. It decodes every valid v2 document variant; product-specific
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
	CanonicalTextmodeAllDocument,
	CanonicalTextmodeCell,
	CanonicalTextmodeCellCollection,
	CanonicalTextmodeDocument,
	CanonicalTextmodeDocumentLayer,
	CanonicalTextmodeSelectedDocument,
	JSONParseResult,
	LegacyTextmodeAllDocumentJSON,
	LegacyTextmodeSelectedDocumentJSON,
	TextmodeAllDocumentJSON,
	TextmodeDocumentDecodeOptions,
	TextmodeDocumentDecodeResult,
	TextmodeDocumentCell,
	TextmodeDocumentCellCollection,
	TextmodeDocumentCellTransform,
	TextmodeDocumentColor,
	TextmodeDocumentError,
	TextmodeDocumentErrorCode,
	TextmodeDocumentFormat,
	TextmodeDocumentGrid,
	TextmodeDocumentJSON,
	TextmodeDocumentLayer,
	TextmodeDocumentLimits,
	TextmodeDocumentMetadata,
	TextmodeDocumentParseResult,
	TextmodeDocumentRGBAColor,
	TextmodeDocumentTarget,
	TextmodeDocumentVersion,
	TextmodeDocumentWarning,
	TextmodeSelectedDocumentJSON,
	TextmodeSelectedDocumentLayer,
} from './types/index.js';
