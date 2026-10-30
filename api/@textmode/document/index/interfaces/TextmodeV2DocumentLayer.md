---
layout: doc
editLink: false
title: TextmodeV2DocumentLayer
description: Layer fields required by the v2 wire format and validated during migration.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [index](../index.md) / TextmodeV2DocumentLayer

# Interface: TextmodeV2DocumentLayer

Layer fields required by the v2 wire format and validated during migration.

## Extends

- [`TextmodeDocumentLayer`](TextmodeDocumentLayer.md)

## Properties

| Property | Type | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-blendmode"></a> `blendMode` | `string` | Nonempty blend mode name; consumers decide which names they support. | - | [`TextmodeDocumentLayer`](TextmodeDocumentLayer.md).[`blendMode`](TextmodeDocumentLayer.md#property-blendmode) |
| <a id="property-cells"></a> `cells` | [`TextmodeDocumentCellCollection`](TextmodeDocumentCellCollection.md) | Complete dense cell data for the grid. | - | [`TextmodeDocumentLayer`](TextmodeDocumentLayer.md).[`cells`](TextmodeDocumentLayer.md#property-cells) |
| <a id="property-font"></a> `font?` | [`TextmodeDocumentFontReference`](TextmodeDocumentFontReference.md) | Optional source-font identity; the font bytes are not embedded. | - | [`TextmodeDocumentLayer`](TextmodeDocumentLayer.md).[`font`](TextmodeDocumentLayer.md#property-font) |
| <a id="property-grid"></a> `grid` | [`TextmodeDocumentGrid`](TextmodeDocumentGrid.md) | Dimensions of the layer cell grid. | - | [`TextmodeDocumentLayer`](TextmodeDocumentLayer.md).[`grid`](TextmodeDocumentLayer.md#property-grid) |
| <a id="property-id"></a> `id` | `string` | Nonempty ID, unique within a frame and reusable across frames. | - | [`TextmodeDocumentLayer`](TextmodeDocumentLayer.md).[`id`](TextmodeDocumentLayer.md#property-id) |
| <a id="property-offsetx"></a> `offsetX` | `number` | Horizontal pixel offset. | [`TextmodeDocumentLayer`](TextmodeDocumentLayer.md).[`offsetX`](TextmodeDocumentLayer.md#property-offsetx) | - |
| <a id="property-offsety"></a> `offsetY` | `number` | Vertical pixel offset. | [`TextmodeDocumentLayer`](TextmodeDocumentLayer.md).[`offsetY`](TextmodeDocumentLayer.md#property-offsety) | - |
| <a id="property-opacity"></a> `opacity` | `number` | Layer opacity from 0 through 1, independent of cell alpha. | - | [`TextmodeDocumentLayer`](TextmodeDocumentLayer.md).[`opacity`](TextmodeDocumentLayer.md#property-opacity) |
| <a id="property-rotationz"></a> `rotationZ` | `number` | Layer rotation in degrees. | [`TextmodeDocumentLayer`](TextmodeDocumentLayer.md).[`rotationZ`](TextmodeDocumentLayer.md#property-rotationz) | - |
| <a id="property-visible"></a> `visible` | `boolean` | Whether the layer is visible; hidden cells remain stored. | - | [`TextmodeDocumentLayer`](TextmodeDocumentLayer.md).[`visible`](TextmodeDocumentLayer.md#property-visible) |
