---
layout: doc
editLink: false
title: CanonicalTextmodeDocumentFrame
description: Decoded complete frame snapshot.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [document](../index.md) / CanonicalTextmodeDocumentFrame

# Interface: CanonicalTextmodeDocumentFrame

Decoded complete frame snapshot.

## Extends

- `Omit`\<[`TextmodeDocumentFrame`](TextmodeDocumentFrame.md), `"layers"`\>

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="property-durationms"></a> `durationMs` | `number` | Positive finite milliseconds, including fractional milliseconds. | [`TextmodeDocumentFrame`](TextmodeDocumentFrame.md).[`durationMs`](TextmodeDocumentFrame.md#property-durationms) |
| <a id="property-layers"></a> `layers` | [`CanonicalTextmodeDocumentLayer`](CanonicalTextmodeDocumentLayer.md)[] | Decoded layers in bottom-first order. | - |
