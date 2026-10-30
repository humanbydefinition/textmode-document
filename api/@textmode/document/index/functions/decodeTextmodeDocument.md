---
layout: doc
editLink: false
title: decodeTextmodeDocument
description: Decode a parsed value and normalize known document fields. Invalid input returns a typed failure; invalid limit configuration throws TypeError.
category: Functions
api: true
kind: Function
lastModified: 2026-10-27
---

[@textmode/document](../../index.md) / [index](../index.md) / decodeTextmodeDocument

# Function: decodeTextmodeDocument()

```ts
function decodeTextmodeDocument(value, options?): TextmodeDocumentDecodeResult;
```

Decode a parsed value and normalize known document fields.
Invalid input returns a typed failure; invalid limit configuration throws TypeError.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `unknown` |
| `options?` | [`TextmodeDocumentDecodeOptions`](../interfaces/TextmodeDocumentDecodeOptions.md) |

## Returns

[`TextmodeDocumentDecodeResult`](../type-aliases/TextmodeDocumentDecodeResult.md)

## Example

```ts
import { decodeTextmodeDocument } from '@textmode/document';
const result = decodeTextmodeDocument({ format: 'unsupported' });
if (!result.ok) console.log(result.error.code);
```
