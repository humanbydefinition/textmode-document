---
layout: doc
editLink: false
title: FontIdentityResult
description: FontIdentityResult type definition and usage in @textmode/document.
category: Type Aliases
api: true
kind: TypeAlias
lastModified: 2026-10-27
---

[@textmode/document](../../index.md) / [font](../index.md) / FontIdentityResult

# Type Alias: FontIdentityResult

```ts
type FontIdentityResult = 
  | {
  font: TextmodeDocumentFontReference;
  ok: true;
}
  | {
  error: {
     code: "INVALID_FONT" | "UNSUPPORTED_FONT" | "LIMIT_EXCEEDED";
     message: string;
  };
  ok: false;
};
```
