---
layout: doc
editLink: false
title: decodeTextmodeDocument
description: Decode a parsed value and normalize known document fields. Supports textmode.document v2, v3.0, v3.1, and v4, and textmode.layer v1 by default. Historical do...
category: Functions
api: true
kind: Function
lastModified: 2026-10-30
---

[@textmode/document](../../index.md) / [index](../index.md) / decodeTextmodeDocument

# Function: decodeTextmodeDocument()

```ts
function decodeTextmodeDocument(value, options?): TextmodeDocumentDecodeResult;
```

Decode a parsed value and normalize known document fields.
Supports textmode.document v2, v3.0, v3.1, and v4, and textmode.layer
v1 by default. Historical documents become a single 100 ms frame. Unknown
fields are omitted, and colors and cell rotations are normalized.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `unknown` | Parsed value to validate and decode. |
| `options?` | [`TextmodeDocumentDecodeOptions`](../interfaces/TextmodeDocumentDecodeOptions.md) | Legacy format policy and resource budget overrides. |

## Returns

[`TextmodeDocumentDecodeResult`](../type-aliases/TextmodeDocumentDecodeResult.md)

A canonical v4 document and migration warnings, or a typed failure.

## Throws

If a configured limit is not a positive safe integer.

## Example

```ts
import { decodeTextmodeDocument } from '@textmode/document';
const result = decodeTextmodeDocument({ format: 'unsupported' });
if (!result.ok) console.log(result.error.code);
```
