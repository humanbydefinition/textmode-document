# Maintaining the document contract

## Ownership

This repository owns the format specification, versioned JSON Schema, portable
types, decoder, and protocol checks. `textmode.export.js` owns renderer extraction,
selection, generator metadata, serialization options, and downloads. Apps own
placement, history, font selection, and supported-feature decisions.

The schema describes portable structure and local constraints. The specification
defines meaning and cross-field rules. The decoder implements these rules plus
normalization and caller budgets. Keep all three consistent through contract
tests; do not generate competing schemas or copy protocol logic into callers.

## Compatibility

Package releases and on-disk versions are independent. Preserve the meaning of
`textmode.document@2.0.0`, including its selected/all distinction and legacy
`canvas` field. A new document version needs an explicit reader, specification,
schema, and compatibility tests before it is accepted. Do not infer support for
future document versions. Namespaced or required extensions need a future design.

Keep published versioned schemas stable. Documentation annotations may improve;
constraint or semantic changes require a compatibility review and explicit
versioning. Changes to normalized results, error codes, paths, migration warnings,
or default limits are also public behavior. Deprecate a JavaScript interface before
removing it from a stable package major.

## Tests and documentation

Fixtures are fixed test inputs. They protect legacy migration and edge cases and
are neither demos nor supported package imports. Keep them in `tests/fixtures`,
out of the package allowlist. Read the fixture README before changing their data.

Validate every complete `json` block in the consumer guide against the schema
and decoder. Keep syntax fragments in the specification clearly labeled. Run
`npm run check` for formatting, lint, Markdown, types, API docs, tests, build, and
an isolated packed-package check. The docs build disables browser sketch checks
because this package has no browser gallery.

## npm releases

The package is prepared for npm as `@textmode/document`. Its package version is
independent of the on-disk `textmode.document@3.0.0` format version. A package
release does not change the document format.

Before publishing, run `npm run check` and inspect `npm pack --dry-run`. Confirm
that the archive contains the runtime, declarations, schemas, and consumer docs,
and excludes fixtures and tests. This repository has no automated npm publish
workflow.

The local v3 integration uses npm-managed `file:` directory dependencies. Run
`npm install` and build this package, then install/build the sibling exporter,
then install/build the apps. npm does not support a `local:` URL protocol. These
references are temporary. Downstream CI and development using these references
require sibling checkouts.
No publishing, release tags, or deployment is part of this refactor.

Version 3 has one layer collection. Preserve the v2 schema and existing fixture
values. Review both visual guides when changing documentation; the v2 guide is
a reference to the old wire format, while the v3 guide explains current output.
