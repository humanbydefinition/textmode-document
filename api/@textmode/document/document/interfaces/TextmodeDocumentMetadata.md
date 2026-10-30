---
layout: doc
editLink: false
title: TextmodeDocumentMetadata
description: Optional producer information; it does not control decoding behavior.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [document](../index.md) / TextmodeDocumentMetadata

# Interface: TextmodeDocumentMetadata

Optional producer information; it does not control decoding behavior.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-createdat"></a> `createdAt` | `string` | Uppercase RFC 3339 timestamp with seconds and a timezone. |
| <a id="property-generator"></a> `generator` | `object` | Producer name and version. |
| `generator.name` | `string` | Producer name. |
| `generator.version` | `string` | Producer version. |
