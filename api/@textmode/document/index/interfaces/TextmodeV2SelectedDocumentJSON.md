---
layout: doc
editLink: false
title: TextmodeV2SelectedDocumentJSON
description: Historical v2 selected-layer wire document.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [index](../index.md) / TextmodeV2SelectedDocumentJSON

# Interface: TextmodeV2SelectedDocumentJSON

Historical v2 selected-layer wire document.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-canvas"></a> `canvas` | `object` | Historical canvas pixel dimensions. |
| `canvas.height` | `number` | Canvas height in pixels. |
| `canvas.width` | `number` | Canvas width in pixels. |
| <a id="property-format"></a> `format` | `"textmode.document"` | Format discriminator. |
| <a id="property-formatversion"></a> `formatVersion` | `"2.0.0"` | Historical wire format version. |
| <a id="property-grid"></a> `grid` | [`TextmodeDocumentGrid`](TextmodeDocumentGrid.md) | Grid dimensions for the selected layer. |
| <a id="property-layer"></a> `layer` | [`TextmodeV2SelectedDocumentLayer`](TextmodeV2SelectedDocumentLayer.md) | Selected layer data. |
| <a id="property-metadata"></a> `metadata?` | [`TextmodeDocumentMetadata`](TextmodeDocumentMetadata.md) | Optional producer metadata. |
| <a id="property-target"></a> `target` | `"selected"` | Shape discriminator for the selected layer or layer stack. |
