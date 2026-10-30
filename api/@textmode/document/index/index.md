---
layout: doc
editLink: false
title: index
description: Dependency-free textmode document protocol codec.
category: Modules
api: true
kind: Module
lastModified: 2026-10-27
---

[@textmode/document](../index.md) / index

# index

Dependency-free textmode document protocol codec.

This entry point contains no DOM, renderer, textmode.js, or media encoder
dependencies. It decodes v3 and migrates supported v1/v2 documents; product-specific
import policy belongs to callers.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [CanonicalTextmodeCell](interfaces/CanonicalTextmodeCell.md) | - |
| [CanonicalTextmodeCellCollection](interfaces/CanonicalTextmodeCellCollection.md) | - |
| [CanonicalTextmodeDocument](interfaces/CanonicalTextmodeDocument.md) | - |
| [CanonicalTextmodeDocumentLayer](interfaces/CanonicalTextmodeDocumentLayer.md) | - |
| [LegacyTextmodeAllDocumentJSON](interfaces/LegacyTextmodeAllDocumentJSON.md) | - |
| [LegacyTextmodeSelectedDocumentJSON](interfaces/LegacyTextmodeSelectedDocumentJSON.md) | - |
| [TextmodeDocumentCell](interfaces/TextmodeDocumentCell.md) | Cell at its redundant row-major x/y coordinates. |
| [TextmodeDocumentCellCollection](interfaces/TextmodeDocumentCellCollection.md) | Dense row-major cell collection. |
| [TextmodeDocumentCellTransform](interfaces/TextmodeDocumentCellTransform.md) | Per-cell transform in degrees. |
| [TextmodeDocumentDecodeOptions](interfaces/TextmodeDocumentDecodeOptions.md) | - |
| [TextmodeDocumentError](interfaces/TextmodeDocumentError.md) | - |
| [TextmodeDocumentFontReference](interfaces/TextmodeDocumentFontReference.md) | Portable identity of a normalized font revision. Matching uses only id. |
| [TextmodeDocumentGrid](interfaces/TextmodeDocumentGrid.md) | Logical grid dimensions and pixel extent of each cell. |
| [TextmodeDocumentJSON](interfaces/TextmodeDocumentJSON.md) | One portable document with one or more ordered layers, bottom first. |
| [TextmodeDocumentLayer](interfaces/TextmodeDocumentLayer.md) | - |
| [TextmodeDocumentLimits](interfaces/TextmodeDocumentLimits.md) | - |
| [TextmodeDocumentMetadata](interfaces/TextmodeDocumentMetadata.md) | Optional producer information; it does not control decoding behavior. |
| [TextmodeDocumentRGBAColor](interfaces/TextmodeDocumentRGBAColor.md) | RGBA color channels, each an integer from 0 through 255. |
| [TextmodeDocumentWarning](interfaces/TextmodeDocumentWarning.md) | - |
| [TextmodeV2AllDocumentJSON](interfaces/TextmodeV2AllDocumentJSON.md) | - |
| [TextmodeV2DocumentLayer](interfaces/TextmodeV2DocumentLayer.md) | Layer fields required by the v2 wire format and validated during migration. |
| [TextmodeV2SelectedDocumentJSON](interfaces/TextmodeV2SelectedDocumentJSON.md) | - |
| [TextmodeV2SelectedDocumentLayer](interfaces/TextmodeV2SelectedDocumentLayer.md) | - |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [JSONParseResult](type-aliases/JSONParseResult.md) | - |
| [TextmodeDocumentColor](type-aliases/TextmodeDocumentColor.md) | On-disk color notation; decoded colors use RGBA channels. |
| [TextmodeDocumentDecodeResult](type-aliases/TextmodeDocumentDecodeResult.md) | - |
| [TextmodeDocumentErrorCode](type-aliases/TextmodeDocumentErrorCode.md) | - |
| [TextmodeDocumentFormat](type-aliases/TextmodeDocumentFormat.md) | Format discriminator encoded in a document. |
| [TextmodeDocumentParseResult](type-aliases/TextmodeDocumentParseResult.md) | - |
| [TextmodeDocumentVersion](type-aliases/TextmodeDocumentVersion.md) | Current on-disk format version, independent of the npm package version. |

## Variables

| Variable | Description |
| ------ | ------ |
| [DEFAULT\_TEXTMODE\_DOCUMENT\_LIMITS](variables/DEFAULT_TEXTMODE_DOCUMENT_LIMITS.md) | Default protocol safety limits. Product-specific limits belong to callers. |
| [LEGACY\_TEXTMODE\_ALL\_VERSION](variables/LEGACY_TEXTMODE_ALL_VERSION.md) | Legacy layer-stack schema revision. |
| [LEGACY\_TEXTMODE\_LAYER\_FORMAT](variables/LEGACY_TEXTMODE_LAYER_FORMAT.md) | Legacy format discriminator accepted by the compatibility decoder. |
| [LEGACY\_TEXTMODE\_SELECTED\_VERSION](variables/LEGACY_TEXTMODE_SELECTED_VERSION.md) | Legacy selected-layer schema revision. |
| [TEXTMODE\_DOCUMENT\_FORMAT](variables/TEXTMODE_DOCUMENT_FORMAT.md) | Canonical format discriminator for textmode document files. |
| [TEXTMODE\_DOCUMENT\_FORMAT\_VERSION](variables/TEXTMODE_DOCUMENT_FORMAT_VERSION.md) | Current textmode document schema revision. |
| [TEXTMODE\_OBJECT\_ROWS\_ENCODING](variables/TEXTMODE_OBJECT_ROWS_ENCODING.md) | Canonical dense row encoding used by textmode document v2. |

## Functions

| Function | Description |
| ------ | ------ |
| [decodeTextmodeDocument](functions/decodeTextmodeDocument.md) | Decode a parsed value and normalize known document fields. Invalid input returns a typed failure; invalid limit configuration throws TypeError. |
| [parseJSON](functions/parseJSON.md) | Parse JSON syntax before routing the resulting value by its format discriminator. |
| [parseTextmodeDocumentJSON](functions/parseTextmodeDocumentJSON.md) | Parse JSON syntax and decode a textmode document in one call. |
