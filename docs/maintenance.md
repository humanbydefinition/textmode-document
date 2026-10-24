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
future `2.x` files. Namespaced or required extensions need a future design.

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

## Publication is deferred

No npm release or publish automation is included in this refactor. Package version
`1.0.0` identifies the prepared package, not a completed registry publication.

Until the package is published, the exporter pins this repository at an exact Git
commit. npm builds Git dependencies through the `prepare` script and creates the
lockfile through normal installation. This keeps clean installs reproducible
without a local directory, manual symlink, or unpublished registry URL.

The source repository is currently private. Local installs need authenticated Git
with repository read access. CI in another repository needs a read credential for
this private repository; its default GitHub token does not grant cross-repository
access. Configure that access before enabling downstream CI for this dependency.
Do not place credentials in a dependency URL or commit them.

Packed verification can use `TEXTMODE_DOCUMENT_TARBALL` to override the Git source
with a local tarball in an isolated consumer. The tarball is test input and is
not committed.

When publication is requested separately, publish the protocol first, replace the
exporter's Git dependency with the exact registry version, and regenerate its
lockfile with npm. Exporter builds generate compatibility schemas from the
installed package; do not commit those generated assets. The beta migration note
must call out the removed fixture imports without changing document version 2.0.0.
