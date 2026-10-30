---
layout: doc
editLink: false
title: identifySfntFont
description: Identify a decoded standalone SFNT font without loading or rendering it.
category: Functions
api: true
kind: Function
lastModified: 2026-10-27
---

[@textmode/document](../../index.md) / [font](../index.md) / identifySfntFont

# Function: identifySfntFont()

```ts
function identifySfntFont(bytes): FontIdentityResult;
```

Identify a decoded standalone SFNT font without loading or rendering it.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `bytes` | `Uint8Array` |

## Returns

[`FontIdentityResult`](../type-aliases/FontIdentityResult.md)

## Example

```ts
const result = identifySfntFont(font.sourceData.copyBytes());
if (result.ok) console.log(result.font.id);
```
