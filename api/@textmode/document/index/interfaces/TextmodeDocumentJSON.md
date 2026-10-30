---
layout: doc
editLink: false
title: TextmodeDocumentJSON
description: One portable document with one or more frames in playback order.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [index](../index.md) / TextmodeDocumentJSON

# Interface: TextmodeDocumentJSON

One portable document with one or more frames in playback order.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-format"></a> `format` | `"textmode.document"` | Document format discriminator. |
| <a id="property-formatversion"></a> `formatVersion` | `"4.0.0"` | Wire format version, independent of the package version. |
| <a id="property-frames"></a> `frames` | [`TextmodeDocumentFrame`](TextmodeDocumentFrame.md)[] | Nonempty sequence of complete snapshots in playback order. |
| <a id="property-metadata"></a> `metadata?` | [`TextmodeDocumentMetadata`](TextmodeDocumentMetadata.md) | Optional producer metadata. |
