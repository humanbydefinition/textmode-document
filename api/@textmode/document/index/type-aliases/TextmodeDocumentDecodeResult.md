---
layout: doc
editLink: false
title: TextmodeDocumentDecodeResult
description: Canonical document and migration warnings on success, or failure details.
category: Type Aliases
api: true
kind: TypeAlias
lastModified: 2026-10-30
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

Canonical document and migration warnings on success, or failure details.
