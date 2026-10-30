---
layout: doc
editLink: false
title: TextmodeDocumentLimits
description: Resource budgets for decoding. Overrides must be positive safe integers.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [index](../index.md) / TextmodeDocumentLimits

# Interface: TextmodeDocumentLimits

Resource budgets for decoding. Overrides must be positive safe integers.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-maxcells"></a> `maxCells?` | `number` | Maximum total cells across all layers and frames. |
| <a id="property-maxcharacterlength"></a> `maxCharacterLength?` | `number` | Maximum Unicode scalar values in a cell glyph. |
| <a id="property-maxframes"></a> `maxFrames?` | `number` | Maximum number of frames. |
| <a id="property-maxlayeridlength"></a> `maxLayerIdLength?` | `number` | Maximum layer ID length in UTF-16 code units. |
| <a id="property-maxlayers"></a> `maxLayers?` | `number` | Maximum layer count within any one frame. |
| <a id="property-maxmetadatastringlength"></a> `maxMetadataStringLength?` | `number` | Maximum length in UTF-16 code units for metadata, blend mode, and font name strings. |
| <a id="property-maxtotallayers"></a> `maxTotalLayers?` | `number` | Cumulative layer instances across all frames. |
