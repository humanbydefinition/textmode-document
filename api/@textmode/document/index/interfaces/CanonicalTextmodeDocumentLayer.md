---
layout: doc
editLink: false
title: CanonicalTextmodeDocumentLayer
description: Decoded layer with canonical cells.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [index](../index.md) / CanonicalTextmodeDocumentLayer

# Interface: CanonicalTextmodeDocumentLayer

Decoded layer with canonical cells.

## Extends

- `Omit`\<[`TextmodeDocumentLayer`](TextmodeDocumentLayer.md), `"cells"`\>

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="property-blendmode"></a> `blendMode` | `string` | Nonempty blend mode name; consumers decide which names they support. | [`TextmodeV2DocumentLayer`](TextmodeV2DocumentLayer.md).[`blendMode`](TextmodeV2DocumentLayer.md#property-blendmode) |
| <a id="property-cells"></a> `cells` | [`CanonicalTextmodeCellCollection`](CanonicalTextmodeCellCollection.md) | Decoded dense cell collection. | - |
| <a id="property-font"></a> `font?` | [`TextmodeDocumentFontReference`](TextmodeDocumentFontReference.md) | Optional source-font identity; the font bytes are not embedded. | [`TextmodeV2DocumentLayer`](TextmodeV2DocumentLayer.md).[`font`](TextmodeV2DocumentLayer.md#property-font) |
| <a id="property-grid"></a> `grid` | [`TextmodeDocumentGrid`](TextmodeDocumentGrid.md) | Dimensions of the layer cell grid. | [`TextmodeV2DocumentLayer`](TextmodeV2DocumentLayer.md).[`grid`](TextmodeV2DocumentLayer.md#property-grid) |
| <a id="property-id"></a> `id` | `string` | Nonempty ID, unique within a frame and reusable across frames. | [`TextmodeV2DocumentLayer`](TextmodeV2DocumentLayer.md).[`id`](TextmodeV2DocumentLayer.md#property-id) |
| <a id="property-offsetx"></a> `offsetX` | `number` | Horizontal pixel offset; positive values move right in textmode.js. | [`TextmodeDocumentLayer`](TextmodeDocumentLayer.md).[`offsetX`](TextmodeDocumentLayer.md#property-offsetx) |
| <a id="property-offsety"></a> `offsetY` | `number` | Vertical pixel offset; positive values move down in textmode.js. | [`TextmodeDocumentLayer`](TextmodeDocumentLayer.md).[`offsetY`](TextmodeDocumentLayer.md#property-offsety) |
| <a id="property-opacity"></a> `opacity` | `number` | Layer opacity from 0 through 1, independent of cell alpha. | [`TextmodeV2DocumentLayer`](TextmodeV2DocumentLayer.md).[`opacity`](TextmodeV2DocumentLayer.md#property-opacity) |
| <a id="property-rotationz"></a> `rotationZ` | `number` | Layer rotation in degrees, preserved without normalization. | [`TextmodeDocumentLayer`](TextmodeDocumentLayer.md).[`rotationZ`](TextmodeDocumentLayer.md#property-rotationz) |
| <a id="property-visible"></a> `visible` | `boolean` | Whether the layer is visible; hidden cells remain stored. | [`TextmodeV2DocumentLayer`](TextmodeV2DocumentLayer.md).[`visible`](TextmodeV2DocumentLayer.md#property-visible) |
