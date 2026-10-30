---
layout: doc
editLink: false
title: TextmodeDocumentDecodeOptions
description: Options for parsing and decoding documents.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [index](../index.md) / TextmodeDocumentDecodeOptions

# Interface: TextmodeDocumentDecodeOptions

Options for parsing and decoding documents.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-acceptlegacy"></a> `acceptLegacy?` | `boolean` | Accept textmode.layer v1. Defaults to true; supported v2 and v3 documents remain readable. |
| <a id="property-limits"></a> `limits?` | [`TextmodeDocumentLimits`](TextmodeDocumentLimits.md) | Budget overrides; omitted values use the default limits. |
