---
layout: doc
editLink: false
title: LegacyTextmodeAllDocumentJSON
description: Legacy v1.1 layer-stack wire document.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [index](../index.md) / LegacyTextmodeAllDocumentJSON

# Interface: LegacyTextmodeAllDocumentJSON

Legacy v1.1 layer-stack wire document.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-schema"></a> `$schema?` | `string` | Optional JSON Schema identifier. |
| <a id="property-canvas"></a> `canvas` | `object` | Historical canvas pixel dimensions. |
| `canvas.height` | `number` | - |
| `canvas.width` | `number` | - |
| <a id="property-format"></a> `format` | `"textmode.layer"` | Format discriminator. |
| <a id="property-formatversion"></a> `formatVersion` | `"1.1.0"` | Historical wire format version. |
| <a id="property-layers"></a> `layers` | [`TextmodeV2DocumentLayer`](TextmodeV2DocumentLayer.md)[] | Layer snapshots in bottom-first order. |
| <a id="property-metadata"></a> `metadata?` | [`TextmodeDocumentMetadata`](TextmodeDocumentMetadata.md) | Optional producer metadata. |
