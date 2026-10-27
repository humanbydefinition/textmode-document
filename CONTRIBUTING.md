# Contributing to `@textmode/document`

Thank you for helping improve the portable textmode document format and its
decoder.

> **Work in progress:** This guide is incomplete.

## Get started

Use Node.js 24 or later and npm 11. Install the dependencies and run the project
checks:

```sh
npm ci
npm run check
```

## Plan a change

Open an [issue](https://github.com/humanbydefinition/textmode-document/issues)
before changing document semantics, supported legacy versions, canonical
output, resource limits, or the public API.

The specification, JSON Schemas, decoder, and contract tests must agree. Update
all affected parts together. Keep fixtures fixed unless a test needs a deliberate
change, and add contract tests for behavior changes.

Use a focused branch from `main` and open a pull request against `main`. Update
the consumer guide or examples when a change affects how people use the package.

Read the [Code of Conduct](CODE_OF_CONDUCT.md). Report security issues privately
by following [SECURITY.md](SECURITY.md), not through a public issue.

For format rules, read the [specification](docs/specification-3.0.md) and
[consumer guide](docs/consumer-guide.md).
