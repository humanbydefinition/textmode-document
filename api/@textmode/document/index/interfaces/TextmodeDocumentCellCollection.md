---
layout: doc
editLink: false
title: TextmodeDocumentCellCollection
description: Dense row-major cell collection.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [index](../index.md) / TextmodeDocumentCellCollection

# Interface: TextmodeDocumentCellCollection

Dense row-major cell collection.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-encoding"></a> `encoding` | `"object-rows-v1"` | Encoding discriminator for dense object rows. |
| <a id="property-rows"></a> `rows` | [`TextmodeDocumentCell`](TextmodeDocumentCell.md)[][] | Rows in top-to-bottom order, each containing cells from left to right. |
