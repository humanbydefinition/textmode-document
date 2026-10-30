---
layout: doc
editLink: false
title: parseJSON
description: Parse JSON syntax before routing the resulting value by its format discriminator.
category: Functions
api: true
kind: Function
lastModified: 2026-10-30
---

[@textmode/document](../../index.md) / [document](../index.md) / parseJSON

# Function: parseJSON()

```ts
function parseJSON(json): JSONParseResult;
```

Parse JSON syntax before routing the resulting value by its format discriminator.

This uses `JSON.parse`, which keeps the last value for a repeated object key.
It does not validate the result as a textmode document.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `json` | `string` | JSON text to parse. |

## Returns

[`JSONParseResult`](../type-aliases/JSONParseResult.md)

The parsed value, or an `INVALID_JSON` error.

## Example

```ts
import { parseJSON } from '@textmode/document';
const parsed = parseJSON('{"format":"textmode.document"}');
if (parsed.ok) console.log(parsed.value);
```
