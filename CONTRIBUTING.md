# Contributing to `@textmode/document`

Thank you for helping improve the portable textmode document format and its decoder.

Read the shared [code contribution guide](https://code.textmode.art/docs/contributing/code) for repository workflow, documentation, testing, and review expectations.

## Quick start

```sh
npm ci
npm run check
```

Open an issue before changing document semantics, supported legacy versions, canonical output, limits, or the public API. Changes to the specification, JSON Schema, and decoder must agree. Add contract tests for behavior changes. Keep the fixtures fixed unless a test case needs a deliberate update.

Read the [Code of Conduct](CODE_OF_CONDUCT.md). Report security issues privately by following [SECURITY.md](SECURITY.md), not through a public issue.

For format questions, read the [specification](docs/specification-3.0.md) and [consumer guide](docs/consumer-guide.md).
