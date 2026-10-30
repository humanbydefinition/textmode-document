---
layout: doc
editLink: false
title: TextmodeDocumentCellTransform
description: Per-cell transform in degrees.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [index](../index.md) / TextmodeDocumentCellTransform

# Interface: TextmodeDocumentCellTransform

Per-cell transform in degrees.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-flipx"></a> `flipX` | `boolean` | Whether to flip the glyph horizontally. |
| <a id="property-flipy"></a> `flipY` | `boolean` | Whether to flip the glyph vertically. |
| <a id="property-invert"></a> `invert` | `boolean` | Whether to swap foreground and background colors. |
| <a id="property-rotation"></a> `rotation` | `number` | Glyph rotation in degrees; decoding normalizes it to [0, 360). |
