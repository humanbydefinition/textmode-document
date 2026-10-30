---
layout: doc
editLink: false
title: identifySfntFont
description: Identify a decoded standalone SFNT font without loading or rendering it.
category: Functions
api: true
kind: Function
lastModified: 2026-10-30
---

[@textmode/document](../../index.md) / [font](../index.md) / identifySfntFont

# Function: identifySfntFont()

```ts
function identifySfntFont(bytes): FontIdentityResult;
```

Identify a decoded standalone SFNT font without loading or rendering it.

Accepts TTF or OTF SFNT bytes up to 16 MiB. WOFF data must be decoded first.
The identity excludes DSIG and normalizes the head checksum adjustment.
The optional font name is for display; match fonts using the complete ID.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `bytes` | `Uint8Array` | Decoded standalone SFNT font data. |

## Returns

[`FontIdentityResult`](../type-aliases/FontIdentityResult.md)

The font reference, or a typed validation error.

## Example

```ts
import { identifySfntFont } from '@textmode/document/font';
const result = identifySfntFont(decodedSfntBytes);
if (result.ok) console.log(result.font.id);
```
