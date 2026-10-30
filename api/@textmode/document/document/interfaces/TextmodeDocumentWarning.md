---
layout: doc
editLink: false
title: TextmodeDocumentWarning
description: Nonfatal change made while migrating a historical document.
category: Interfaces
api: true
kind: Interface
lastModified: 2026-10-30
isInterface: true
---

[@textmode/document](../../index.md) / [document](../index.md) / TextmodeDocumentWarning

# Interface: TextmodeDocumentWarning

Nonfatal change made while migrating a historical document.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-code"></a> `code` | \| `"LEGACY_DOCUMENT_MIGRATED"` \| `"DOCUMENT_VERSION_MIGRATED"` \| `"LAYER_ID_REASSIGNED"` | Machine-readable migration warning category. |
| <a id="property-message"></a> `message` | `string` | Human-readable explanation. |
| <a id="property-path"></a> `path?` | `string` | Path to the relevant input value, when available. |
