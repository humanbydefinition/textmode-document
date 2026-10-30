---
layout: doc
editLink: false
title: JSONParseResult
description: JSON syntax result; a successful value has not been validated as a document.
category: Type Aliases
api: true
kind: TypeAlias
lastModified: 2026-10-30
---

[@textmode/document](../../index.md) / [document](../index.md) / JSONParseResult

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

JSON syntax result; a successful value has not been validated as a document.
