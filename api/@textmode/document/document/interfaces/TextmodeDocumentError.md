---
layout: doc
editLink: false
title: TextmodeDocumentError
description: Failure details for invalid input or an exceeded budget.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [document](../index.md) / TextmodeDocumentError

# Interface: TextmodeDocumentError

Failure details for invalid input or an exceeded budget.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-code"></a> `code` | [`TextmodeDocumentErrorCode`](../type-aliases/TextmodeDocumentErrorCode.md) | Machine-readable failure category. |
| <a id="property-message"></a> `message` | `string` | Human-readable explanation. |
| <a id="property-path"></a> `path?` | `string` | Path to the relevant input value, when available. |
