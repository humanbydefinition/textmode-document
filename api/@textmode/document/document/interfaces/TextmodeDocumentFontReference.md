---
layout: doc
editLink: false
title: TextmodeDocumentFontReference
description: Portable identity of a normalized font revision. Matching uses only id.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [document](../index.md) / TextmodeDocumentFontReference

# Interface: TextmodeDocumentFontReference

Portable identity of a normalized font revision. Matching uses only id.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-id"></a> `id` | `` `sfnt-v1-sha256:${string}` `` | Complete normalized SFNT identity, including a lowercase SHA-256 digest. |
| <a id="property-name"></a> `name?` | `string` | Optional display name; do not use it for identity matching. |
