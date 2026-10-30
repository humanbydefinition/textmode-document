---
layout: doc
editLink: false
title: TextmodeV31DocumentJSON
description: Historical v3.1 wire document with optional font references.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [document](../index.md) / TextmodeV31DocumentJSON

# Interface: TextmodeV31DocumentJSON

Historical v3.1 wire document with optional font references.

## Extends

- `Omit`\<[`TextmodeV3DocumentJSON`](TextmodeV3DocumentJSON.md), `"formatVersion"` \| `"layers"`\>

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="property-format"></a> `format` | `"textmode.document"` | Format discriminator. | [`TextmodeV3DocumentJSON`](TextmodeV3DocumentJSON.md).[`format`](TextmodeV3DocumentJSON.md#property-format) |
| <a id="property-formatversion"></a> `formatVersion` | `"3.1.0"` | Historical wire format version. | - |
| <a id="property-layers"></a> `layers` | [`TextmodeDocumentLayer`](TextmodeDocumentLayer.md)[] | Layer snapshots in bottom-first order. | - |
| <a id="property-metadata"></a> `metadata?` | [`TextmodeDocumentMetadata`](TextmodeDocumentMetadata.md) | Optional producer metadata. | [`TextmodeV3DocumentJSON`](TextmodeV3DocumentJSON.md).[`metadata`](TextmodeV3DocumentJSON.md#property-metadata) |
