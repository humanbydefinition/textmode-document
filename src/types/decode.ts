import type { CanonicalTextmodeDocument } from './canonical.js';

/**
 * Resource budgets for decoding. Overrides must be positive safe integers.
 *
 * @category Parsing and decoding
 */
export interface TextmodeDocumentLimits {
	/** Maximum total cells across all layers and frames. */
	maxCells?: number;
	/** Maximum number of frames. */
	maxFrames?: number;
	/** Maximum layer count within any one frame. */
	maxLayers?: number;
	/** Cumulative layer instances across all frames. */
	maxTotalLayers?: number;
	/** Maximum layer ID length in UTF-16 code units. */
	maxLayerIdLength?: number;
	/** Maximum Unicode scalar values in a cell glyph. */
	maxCharacterLength?: number;
	/** Maximum length in UTF-16 code units for metadata, blend mode, and font name strings. */
	maxMetadataStringLength?: number;
}

/**
 * Options for parsing and decoding documents.
 *
 * @category Parsing and decoding
 */
export interface TextmodeDocumentDecodeOptions {
	/** Budget overrides; omitted values use the default limits. */
	limits?: TextmodeDocumentLimits;
	/** Accept textmode.layer v1. Defaults to true; supported v2 and v3 documents remain readable. */
	acceptLegacy?: boolean;
}

/**
 * Error codes returned by JSON parsing and document decoding.
 *
 * @category Parsing and decoding
 */
export type TextmodeDocumentErrorCode =
	| 'INVALID_JSON'
	| 'INVALID_DOCUMENT'
	| 'UNSUPPORTED_FORMAT'
	| 'UNSUPPORTED_VERSION'
	| 'UNSUPPORTED_TARGET'
	| 'UNSUPPORTED_ENCODING'
	| 'LIMIT_EXCEEDED';

/**
 * Failure details for invalid input or an exceeded budget.
 *
 * @category Parsing and decoding
 */
export interface TextmodeDocumentError {
	/** Machine-readable failure category. */
	code: TextmodeDocumentErrorCode;
	/** Human-readable explanation. */
	message: string;
	/** Path to the relevant input value, when available. */
	path?: string;
}

/**
 * Nonfatal change made while migrating a historical document.
 *
 * @category Parsing and decoding
 */
export interface TextmodeDocumentWarning {
	/** Machine-readable migration warning category. */
	code: 'LEGACY_DOCUMENT_MIGRATED' | 'DOCUMENT_VERSION_MIGRATED' | 'LAYER_ID_REASSIGNED';
	/** Human-readable explanation. */
	message: string;
	/** Path to the relevant input value, when available. */
	path?: string;
}

/**
 * JSON syntax result; a successful value has not been validated as a document.
 *
 * @category Parsing and decoding
 */
export type JSONParseResult = { ok: true; value: unknown } | { ok: false; error: TextmodeDocumentError };

/**
 * Canonical document and migration warnings on success, or failure details.
 *
 * @category Parsing and decoding
 */
export type TextmodeDocumentDecodeResult =
	| {
			ok: true;
			document: CanonicalTextmodeDocument;
			warnings: TextmodeDocumentWarning[];
	  }
	| { ok: false; error: TextmodeDocumentError };

/**
 * Result of parsing JSON and decoding its document.
 *
 * @category Parsing and decoding
 */
export type TextmodeDocumentParseResult = TextmodeDocumentDecodeResult;
