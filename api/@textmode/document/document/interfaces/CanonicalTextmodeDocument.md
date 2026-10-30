---
layout: doc
editLink: false
title: CanonicalTextmodeDocument
description: Canonical v4 document returned by the decoder, including migrated input.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [document](../index.md) / CanonicalTextmodeDocument

# Interface: CanonicalTextmodeDocument

Canonical v4 document returned by the decoder, including migrated input.

## Extends

- `Omit`\<[`TextmodeDocumentJSON`](TextmodeDocumentJSON.md), `"frames"`\>

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="property-format"></a> `format` | `"textmode.document"` | Document format discriminator. | [`TextmodeDocumentJSON`](TextmodeDocumentJSON.md).[`format`](TextmodeDocumentJSON.md#property-format) |
| <a id="property-formatversion"></a> `formatVersion` | `"4.0.0"` | Wire format version, independent of the package version. | [`TextmodeDocumentJSON`](TextmodeDocumentJSON.md).[`formatVersion`](TextmodeDocumentJSON.md#property-formatversion) |
| <a id="property-frames"></a> `frames` | [`CanonicalTextmodeDocumentFrame`](CanonicalTextmodeDocumentFrame.md)[] | Decoded frames in playback order. | - |
| <a id="property-metadata"></a> `metadata?` | [`TextmodeDocumentMetadata`](TextmodeDocumentMetadata.md) | Optional producer metadata. | [`TextmodeDocumentJSON`](TextmodeDocumentJSON.md).[`metadata`](TextmodeDocumentJSON.md#property-metadata) |
