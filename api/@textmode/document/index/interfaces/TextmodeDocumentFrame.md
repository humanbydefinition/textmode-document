---
layout: doc
editLink: false
title: TextmodeDocumentFrame
description: Complete snapshot. Layers are bottom first; an empty stack is a blank frame.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [index](../index.md) / TextmodeDocumentFrame

# Interface: TextmodeDocumentFrame

Complete snapshot. Layers are bottom first; an empty stack is a blank frame.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-durationms"></a> `durationMs` | `number` | Positive finite milliseconds, including fractional milliseconds. |
| <a id="property-layers"></a> `layers` | [`TextmodeDocumentLayer`](TextmodeDocumentLayer.md)[] | Complete layer snapshots, bottom first. An empty array represents a blank frame. |
