---
layout: doc
editLink: false
title: TextmodeV2AllDocumentJSON
description: Historical v2 layer-stack wire document.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [document](../index.md) / TextmodeV2AllDocumentJSON

# Interface: TextmodeV2AllDocumentJSON

Historical v2 layer-stack wire document.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-canvas"></a> `canvas` | `object` | Historical canvas pixel dimensions. |
| `canvas.height` | `number` | Canvas height in pixels. |
| `canvas.width` | `number` | Canvas width in pixels. |
| <a id="property-format"></a> `format` | `"textmode.document"` | Format discriminator. |
| <a id="property-formatversion"></a> `formatVersion` | `"2.0.0"` | Historical wire format version. |
| <a id="property-layers"></a> `layers` | [`TextmodeV2DocumentLayer`](TextmodeV2DocumentLayer.md)[] | Layer snapshots in bottom-first order. |
| <a id="property-metadata"></a> `metadata?` | [`TextmodeDocumentMetadata`](TextmodeDocumentMetadata.md) | Optional producer metadata. |
| <a id="property-target"></a> `target` | `"all"` | Shape discriminator for the selected layer or layer stack. |
