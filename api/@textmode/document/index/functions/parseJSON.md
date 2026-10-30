---
layout: doc
editLink: false
title: parseJSON
description: Parse JSON syntax before routing the resulting value by its format discriminator.
category: Functions
api: true
kind: Function
lastModified: 2026-10-27
---

[@textmode/document](../../index.md) / [index](../index.md) / parseJSON

# Function: parseJSON()

```ts
function parseJSON(json): JSONParseResult;
```

Parse JSON syntax before routing the resulting value by its format discriminator.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `json` | `string` |

## Returns

[`JSONParseResult`](../type-aliases/JSONParseResult.md)

## Example

```ts
import { parseJSON } from '@textmode/document';
const parsed = parseJSON('{"format":"textmode.document"}');
if (parsed.ok) console.log(parsed.value);
```
