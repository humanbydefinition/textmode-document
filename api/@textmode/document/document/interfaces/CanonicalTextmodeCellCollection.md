---
layout: doc
editLink: false
title: CanonicalTextmodeCellCollection
description: Dense collection of decoded cells.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [document](../index.md) / CanonicalTextmodeCellCollection

# Interface: CanonicalTextmodeCellCollection

Dense collection of decoded cells.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-encoding"></a> `encoding` | `"object-rows-v1"` | Dense object-row encoding discriminator. |
| <a id="property-rows"></a> `rows` | [`CanonicalTextmodeCell`](CanonicalTextmodeCell.md)[][] | Decoded cells in row-major order. |
