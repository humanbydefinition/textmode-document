---
layout: doc
editLink: false
title: document
description: Dependency-free textmode document protocol codec.
category: Modules
api: true
kind: Module
lastModified: 2026-10-30
---

[@textmode/document](../index.md) / document

# document

Dependency-free textmode document protocol codec.

This entry point contains no DOM, renderer, textmode.js, or media encoder
dependencies. It decodes v4 frames and migrates supported v1/v2/v3 documents; product-specific
import policy belongs to callers.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [CanonicalTextmodeCell](interfaces/CanonicalTextmodeCell.md) | Decoded cell with RGBA colors and normalized cell rotation. |
| [CanonicalTextmodeCellCollection](interfaces/CanonicalTextmodeCellCollection.md) | Dense collection of decoded cells. |
| [CanonicalTextmodeDocument](interfaces/CanonicalTextmodeDocument.md) | Canonical v4 document returned by the decoder, including migrated input. |
| [CanonicalTextmodeDocumentFrame](interfaces/CanonicalTextmodeDocumentFrame.md) | Decoded complete frame snapshot. |
| [CanonicalTextmodeDocumentLayer](interfaces/CanonicalTextmodeDocumentLayer.md) | Decoded layer with canonical cells. |
| [LegacyTextmodeAllDocumentJSON](interfaces/LegacyTextmodeAllDocumentJSON.md) | Legacy v1.1 layer-stack wire document. |
| [LegacyTextmodeSelectedDocumentJSON](interfaces/LegacyTextmodeSelectedDocumentJSON.md) | Legacy v1.0 selected-layer wire document. |
| [TextmodeDocumentCell](interfaces/TextmodeDocumentCell.md) | Cell at its redundant row-major x/y coordinates. |
| [TextmodeDocumentCellCollection](interfaces/TextmodeDocumentCellCollection.md) | Dense row-major cell collection. |
| [TextmodeDocumentCellTransform](interfaces/TextmodeDocumentCellTransform.md) | Per-cell transform in degrees. |
| [TextmodeDocumentDecodeOptions](interfaces/TextmodeDocumentDecodeOptions.md) | Options for parsing and decoding documents. |
| [TextmodeDocumentError](interfaces/TextmodeDocumentError.md) | Failure details for invalid input or an exceeded budget. |
| [TextmodeDocumentFontReference](interfaces/TextmodeDocumentFontReference.md) | Portable identity of a normalized font revision. Matching uses only id. |
| [TextmodeDocumentFrame](interfaces/TextmodeDocumentFrame.md) | Complete snapshot. Layers are bottom first; an empty stack is a blank frame. |
| [TextmodeDocumentGrid](interfaces/TextmodeDocumentGrid.md) | Logical grid dimensions and pixel extent of each cell. |
| [TextmodeDocumentJSON](interfaces/TextmodeDocumentJSON.md) | One portable document with one or more frames in playback order. |
| [TextmodeDocumentLayer](interfaces/TextmodeDocumentLayer.md) | Complete layer snapshot with presentation, grid, and cell data. |
| [TextmodeDocumentLimits](interfaces/TextmodeDocumentLimits.md) | Resource budgets for decoding. Overrides must be positive safe integers. |
| [TextmodeDocumentMetadata](interfaces/TextmodeDocumentMetadata.md) | Optional producer information; it does not control decoding behavior. |
| [TextmodeDocumentRGBAColor](interfaces/TextmodeDocumentRGBAColor.md) | RGBA color channels, each an integer from 0 through 255. |
| [TextmodeDocumentWarning](interfaces/TextmodeDocumentWarning.md) | Nonfatal change made while migrating a historical document. |
| [TextmodeV2AllDocumentJSON](interfaces/TextmodeV2AllDocumentJSON.md) | Historical v2 layer-stack wire document. |
| [TextmodeV2DocumentLayer](interfaces/TextmodeV2DocumentLayer.md) | Layer fields required by the v2 wire format and validated during migration. |
| [TextmodeV2SelectedDocumentJSON](interfaces/TextmodeV2SelectedDocumentJSON.md) | Historical v2 selected-layer wire document. |
| [TextmodeV2SelectedDocumentLayer](interfaces/TextmodeV2SelectedDocumentLayer.md) | Selected-layer payload in the historical v2 wire format. |
| [TextmodeV31DocumentJSON](interfaces/TextmodeV31DocumentJSON.md) | Historical v3.1 wire document with optional font references. |
| [TextmodeV3DocumentJSON](interfaces/TextmodeV3DocumentJSON.md) | Historical v3.0 wire document; decoding returns canonical v4 frames. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [JSONParseResult](type-aliases/JSONParseResult.md) | JSON syntax result; a successful value has not been validated as a document. |
| [TextmodeDocumentColor](type-aliases/TextmodeDocumentColor.md) | On-disk color as `#RRGGBB`, `#RRGGBBAA`, or RGBA channels. Decoding produces RGBA channels. |
| [TextmodeDocumentDecodeResult](type-aliases/TextmodeDocumentDecodeResult.md) | Canonical document and migration warnings on success, or failure details. |
| [TextmodeDocumentErrorCode](type-aliases/TextmodeDocumentErrorCode.md) | Error codes returned by JSON parsing and document decoding. |
| [TextmodeDocumentFormat](type-aliases/TextmodeDocumentFormat.md) | Format discriminator encoded in a document. |
| [TextmodeDocumentParseResult](type-aliases/TextmodeDocumentParseResult.md) | Result of parsing JSON and decoding its document. |
| [TextmodeDocumentVersion](type-aliases/TextmodeDocumentVersion.md) | Current on-disk format version, independent of the npm package version. |
| [TextmodeV3DocumentLayer](type-aliases/TextmodeV3DocumentLayer.md) | Historical v3.0 layer. Font references were not part of this version. |

## Variables

| Variable | Description |
| ------ | ------ |
| [DEFAULT\_TEXTMODE\_DOCUMENT\_LIMITS](variables/DEFAULT_TEXTMODE_DOCUMENT_LIMITS.md) | Default protocol safety limits. Product-specific limits belong to callers. |
| [LEGACY\_TEXTMODE\_ALL\_VERSION](variables/LEGACY_TEXTMODE_ALL_VERSION.md) | Legacy layer-stack schema revision. |
| [LEGACY\_TEXTMODE\_LAYER\_FORMAT](variables/LEGACY_TEXTMODE_LAYER_FORMAT.md) | Legacy format discriminator accepted by the compatibility decoder. |
| [LEGACY\_TEXTMODE\_SELECTED\_VERSION](variables/LEGACY_TEXTMODE_SELECTED_VERSION.md) | Legacy selected-layer schema revision. |
| [TEXTMODE\_DOCUMENT\_FORMAT](variables/TEXTMODE_DOCUMENT_FORMAT.md) | Canonical format discriminator for textmode document files. |
| [TEXTMODE\_DOCUMENT\_FORMAT\_VERSION](variables/TEXTMODE_DOCUMENT_FORMAT_VERSION.md) | Current textmode document schema revision. |
| [TEXTMODE\_OBJECT\_ROWS\_ENCODING](variables/TEXTMODE_OBJECT_ROWS_ENCODING.md) | Canonical dense row encoding used by supported textmode document versions. |

## Functions

| Function | Description |
| ------ | ------ |
| [decodeTextmodeDocument](functions/decodeTextmodeDocument.md) | Decode a parsed value and normalize known document fields. Supports textmode.document v2, v3.0, v3.1, and v4, and textmode.layer v1 by default. Historical documents become a single 100 ms frame. Unknown fields are omitted, and colors and cell rotations are normalized. |
| [parseJSON](functions/parseJSON.md) | Parse JSON syntax before routing the resulting value by its format discriminator. |
| [parseTextmodeDocumentJSON](functions/parseTextmodeDocumentJSON.md) | Parse JSON syntax and decode a textmode document in one synchronous call. |
