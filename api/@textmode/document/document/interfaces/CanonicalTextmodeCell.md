---
layout: doc
editLink: false
title: CanonicalTextmodeCell
description: Decoded cell with RGBA colors and normalized cell rotation.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [document](../index.md) / CanonicalTextmodeCell

# Interface: CanonicalTextmodeCell

Decoded cell with RGBA colors and normalized cell rotation.

## Extends

- `Omit`\<[`TextmodeDocumentCell`](TextmodeDocumentCell.md), `"foreground"` \| `"background"`\>

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="property-background"></a> `background` | [`TextmodeDocumentRGBAColor`](TextmodeDocumentRGBAColor.md) | Decoded background color. | - |
| <a id="property-character"></a> `character` | `string` | Nonempty, well-formed Unicode glyph string. It can contain multiple scalar values. | [`TextmodeDocumentCell`](TextmodeDocumentCell.md).[`character`](TextmodeDocumentCell.md#property-character) |
| <a id="property-foreground"></a> `foreground` | [`TextmodeDocumentRGBAColor`](TextmodeDocumentRGBAColor.md) | Decoded glyph color. | - |
| <a id="property-transform"></a> `transform` | [`TextmodeDocumentCellTransform`](TextmodeDocumentCellTransform.md) | Glyph and color transforms. | [`TextmodeDocumentCell`](TextmodeDocumentCell.md).[`transform`](TextmodeDocumentCell.md#property-transform) |
| <a id="property-x"></a> `x` | `number` | Zero-based column, matching the cell position in its row. | [`TextmodeDocumentCell`](TextmodeDocumentCell.md).[`x`](TextmodeDocumentCell.md#property-x) |
| <a id="property-y"></a> `y` | `number` | Zero-based row, matching the cell position in the collection. | [`TextmodeDocumentCell`](TextmodeDocumentCell.md).[`y`](TextmodeDocumentCell.md#property-y) |
