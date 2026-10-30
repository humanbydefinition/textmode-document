---
layout: doc
editLink: false
title: TextmodeV3DocumentJSON
description: Historical v3.0 wire document; decoding returns canonical v4 frames.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [document](../index.md) / TextmodeV3DocumentJSON

# Interface: TextmodeV3DocumentJSON

Historical v3.0 wire document; decoding returns canonical v4 frames.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-format"></a> `format` | `"textmode.document"` | Format discriminator. |
| <a id="property-formatversion"></a> `formatVersion` | `"3.0.0"` | Historical wire format version. |
| <a id="property-layers"></a> `layers` | [`TextmodeV3DocumentLayer`](../type-aliases/TextmodeV3DocumentLayer.md)[] | Layer snapshots in bottom-first order. |
| <a id="property-metadata"></a> `metadata?` | [`TextmodeDocumentMetadata`](TextmodeDocumentMetadata.md) | Optional producer metadata. |
