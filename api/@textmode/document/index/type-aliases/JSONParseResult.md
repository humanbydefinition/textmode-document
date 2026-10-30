---
layout: doc
editLink: false
title: JSONParseResult
description: JSONParseResult type definition and usage in @textmode/document.
category: Type Aliases
api: true
kind: TypeAlias
lastModified: 2026-10-27
---

[@textmode/document](../../index.md) / [index](../index.md) / JSONParseResult

# Type Alias: JSONParseResult

```ts
type JSONParseResult = 
  | {
  ok: true;
  value: unknown;
}
  | {
  error: TextmodeDocumentError;
  ok: false;
};
```
