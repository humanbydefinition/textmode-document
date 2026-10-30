---
layout: doc
editLink: false
title: TextmodeDocumentDecodeResult
description: TextmodeDocumentDecodeResult type definition and usage in @textmode/document.
category: Type Aliases
api: true
kind: TypeAlias
lastModified: 2026-10-27
---

[@textmode/document](../../index.md) / [index](../index.md) / TextmodeDocumentDecodeResult

# Type Alias: TextmodeDocumentDecodeResult

```ts
type TextmodeDocumentDecodeResult = 
  | {
  document: CanonicalTextmodeDocument;
  ok: true;
  warnings: TextmodeDocumentWarning[];
}
  | {
  error: TextmodeDocumentError;
  ok: false;
};
```
