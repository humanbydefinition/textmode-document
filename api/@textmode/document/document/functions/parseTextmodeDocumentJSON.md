---
layout: doc
editLink: false
title: parseTextmodeDocumentJSON
description: Parse JSON syntax and decode a textmode document in one synchronous call.
category: Functions
api: true
kind: Function
lastModified: 2026-10-30
---

[@textmode/document](../../index.md) / [document](../index.md) / parseTextmodeDocumentJSON

# Function: parseTextmodeDocumentJSON()

```ts
function parseTextmodeDocumentJSON(json, options?): TextmodeDocumentDecodeResult;
```

Parse JSON syntax and decode a textmode document in one synchronous call.

Apply input byte limits before calling this function; decoder budgets apply
after JSON parsing.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `json` | `string` | JSON text containing a textmode document. |
| `options?` | [`TextmodeDocumentDecodeOptions`](../interfaces/TextmodeDocumentDecodeOptions.md) | Legacy format policy and resource budget overrides. |

## Returns

[`TextmodeDocumentDecodeResult`](../type-aliases/TextmodeDocumentDecodeResult.md)

A canonical v4 document and migration warnings, or a typed failure.

## Throws

If a configured limit is not a positive safe integer.

## Example

```ts
import { parseTextmodeDocumentJSON } from '@textmode/document';
const result = parseTextmodeDocumentJSON('{');
if (!result.ok) console.log(result.error.code); // INVALID_JSON
```
