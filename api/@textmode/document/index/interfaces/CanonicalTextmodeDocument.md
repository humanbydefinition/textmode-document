---
layout: doc
editLink: false
title: CanonicalTextmodeDocument
description: API documentation for the CanonicalTextmodeDocument interface in @textmode/document.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-27
isInterface: true
---

[@textmode/document](../../index.md) / [index](../index.md) / CanonicalTextmodeDocument

# Interface: CanonicalTextmodeDocument

## Extends

- `Omit`\<[`TextmodeDocumentJSON`](TextmodeDocumentJSON.md), `"layers"`\>

## Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="property-format"></a> `format` | `"textmode.document"` | [`TextmodeDocumentJSON`](TextmodeDocumentJSON.md).[`format`](TextmodeDocumentJSON.md#property-format) |
| <a id="property-formatversion"></a> `formatVersion` | `"3.1.0"` | [`TextmodeDocumentJSON`](TextmodeDocumentJSON.md).[`formatVersion`](TextmodeDocumentJSON.md#property-formatversion) |
| <a id="property-layers"></a> `layers` | [`CanonicalTextmodeDocumentLayer`](CanonicalTextmodeDocumentLayer.md)[] | - |
| <a id="property-metadata"></a> `metadata?` | [`TextmodeDocumentMetadata`](TextmodeDocumentMetadata.md) | [`TextmodeDocumentJSON`](TextmodeDocumentJSON.md).[`metadata`](TextmodeDocumentJSON.md#property-metadata) |
