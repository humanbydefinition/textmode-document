---
layout: doc
editLink: false
title: TextmodeDocumentLayer
description: Complete layer snapshot with presentation, grid, and cell data.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [index](../index.md) / TextmodeDocumentLayer

# Interface: TextmodeDocumentLayer

Complete layer snapshot with presentation, grid, and cell data.

## Extended by

- [`TextmodeV2DocumentLayer`](TextmodeV2DocumentLayer.md)

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-blendmode"></a> `blendMode` | `string` | Nonempty blend mode name; consumers decide which names they support. |
| <a id="property-cells"></a> `cells` | [`TextmodeDocumentCellCollection`](TextmodeDocumentCellCollection.md) | Complete dense cell data for the grid. |
| <a id="property-font"></a> `font?` | [`TextmodeDocumentFontReference`](TextmodeDocumentFontReference.md) | Optional source-font identity; the font bytes are not embedded. |
| <a id="property-grid"></a> `grid` | [`TextmodeDocumentGrid`](TextmodeDocumentGrid.md) | Dimensions of the layer cell grid. |
| <a id="property-id"></a> `id` | `string` | Nonempty ID, unique within a frame and reusable across frames. |
| <a id="property-offsetx"></a> `offsetX` | `number` | Horizontal pixel offset; positive values move right in textmode.js. |
| <a id="property-offsety"></a> `offsetY` | `number` | Vertical pixel offset; positive values move down in textmode.js. |
| <a id="property-opacity"></a> `opacity` | `number` | Layer opacity from 0 through 1, independent of cell alpha. |
| <a id="property-rotationz"></a> `rotationZ` | `number` | Layer rotation in degrees, preserved without normalization. |
| <a id="property-visible"></a> `visible` | `boolean` | Whether the layer is visible; hidden cells remain stored. |
