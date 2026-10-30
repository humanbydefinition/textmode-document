---
layout: doc
editLink: false
title: LegacyTextmodeSelectedDocumentJSON
description: Legacy v1.0 selected-layer wire document.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [index](../index.md) / LegacyTextmodeSelectedDocumentJSON

# Interface: LegacyTextmodeSelectedDocumentJSON

Legacy v1.0 selected-layer wire document.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-schema"></a> `$schema?` | `string` | Optional JSON Schema identifier. |
| <a id="property-canvas"></a> `canvas` | `object` | Historical canvas pixel dimensions. |
| `canvas.height` | `number` | - |
| `canvas.width` | `number` | - |
| <a id="property-format"></a> `format` | `"textmode.layer"` | Format discriminator. |
| <a id="property-formatversion"></a> `formatVersion` | `"1.0.0"` | Historical wire format version. |
| <a id="property-grid"></a> `grid` | [`TextmodeDocumentGrid`](TextmodeDocumentGrid.md) | Grid dimensions for the selected layer. |
| <a id="property-layer"></a> `layer` | [`TextmodeV2SelectedDocumentLayer`](TextmodeV2SelectedDocumentLayer.md) | Selected layer data. |
| <a id="property-metadata"></a> `metadata?` | [`TextmodeDocumentMetadata`](TextmodeDocumentMetadata.md) | Optional producer metadata. |
