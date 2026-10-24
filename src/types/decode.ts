import type { CanonicalTextmodeDocument } from './canonical.js';

export interface TextmodeDocumentLimits {
	maxCells?: number;
	maxLayers?: number;
	maxLayerIdLength?: number;
	maxCharacterLength?: number;
	maxMetadataStringLength?: number;
}

export interface TextmodeDocumentDecodeOptions {
	limits?: TextmodeDocumentLimits;
	acceptLegacy?: boolean;
}

export type TextmodeDocumentErrorCode =
	| 'INVALID_JSON'
	| 'INVALID_DOCUMENT'
	| 'UNSUPPORTED_FORMAT'
	| 'UNSUPPORTED_VERSION'
	| 'UNSUPPORTED_TARGET'
	| 'UNSUPPORTED_ENCODING'
	| 'LIMIT_EXCEEDED';

export interface TextmodeDocumentError {
	code: TextmodeDocumentErrorCode;
	message: string;
	path?: string;
}

export interface TextmodeDocumentWarning {
	code: 'LEGACY_DOCUMENT_MIGRATED';
	message: string;
}

export type JSONParseResult = { ok: true; value: unknown } | { ok: false; error: TextmodeDocumentError };

export type TextmodeDocumentDecodeResult =
	| {
			ok: true;
			document: CanonicalTextmodeDocument;
			warnings: TextmodeDocumentWarning[];
	  }
	| { ok: false; error: TextmodeDocumentError };

export type TextmodeDocumentParseResult = TextmodeDocumentDecodeResult;
