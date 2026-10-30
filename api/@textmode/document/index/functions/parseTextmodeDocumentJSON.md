---
layout: doc
editLink: false
title: parseTextmodeDocumentJSON
description: Parse JSON syntax and decode a textmode document in one call.
category: Functions
api: true
kind: Function
lastModified: 2026-10-27
---

[@textmode/document](../../index.md) / [index](../index.md) / parseTextmodeDocumentJSON

# Function: parseTextmodeDocumentJSON()

```ts
function parseTextmodeDocumentJSON(json, options?): TextmodeDocumentDecodeResult;
```

Parse JSON syntax and decode a textmode document in one call.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `json` | `string` |
| `options?` | [`TextmodeDocumentDecodeOptions`](../interfaces/TextmodeDocumentDecodeOptions.md) |

## Returns

[`TextmodeDocumentDecodeResult`](../type-aliases/TextmodeDocumentDecodeResult.md)

## Example

```ts
import { parseTextmodeDocumentJSON } from '@textmode/document';
const result = parseTextmodeDocumentJSON('{');
if (!result.ok) console.log(result.error.code); // INVALID_JSON
```
