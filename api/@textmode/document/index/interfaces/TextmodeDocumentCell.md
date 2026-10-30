---
layout: doc
editLink: false
title: TextmodeDocumentCell
description: Cell at its redundant row-major x/y coordinates.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [index](../index.md) / TextmodeDocumentCell

# Interface: TextmodeDocumentCell

Cell at its redundant row-major x/y coordinates.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-background"></a> `background` | [`TextmodeDocumentColor`](../type-aliases/TextmodeDocumentColor.md) | Cell background color. |
| <a id="property-character"></a> `character` | `string` | Nonempty, well-formed Unicode glyph string. It can contain multiple scalar values. |
| <a id="property-foreground"></a> `foreground` | [`TextmodeDocumentColor`](../type-aliases/TextmodeDocumentColor.md) | Glyph color. |
| <a id="property-transform"></a> `transform` | [`TextmodeDocumentCellTransform`](TextmodeDocumentCellTransform.md) | Glyph and color transforms. |
| <a id="property-x"></a> `x` | `number` | Zero-based column, matching the cell position in its row. |
| <a id="property-y"></a> `y` | `number` | Zero-based row, matching the cell position in the collection. |
