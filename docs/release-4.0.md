# Migrate to format 4.0

Package `3.0.0-dev.0` prepares a breaking API change for document format `4.0.0`.
The package version and document version are independent. This guide describes
future consumer work; this release changes only `textmode-document`.

## Protocol and API changes

Read `result.document.frames` instead of `result.document.layers`. Each frame
requires `durationMs` and a complete bottom-to-top `layers` stack. An empty stack
is a blank interval. Every supported historical input becomes one 100 ms frame.
There is no root layer alias, second decoder, or version-dependent result shape.

The root exports `TextmodeDocumentFrame` and `CanonicalTextmodeDocumentFrame`.
`TextmodeV3DocumentJSON` and `TextmodeV31DocumentJSON` describe historical wire
inputs. The latest wire and canonical document types describe v4 only.
Import the current schema from `@textmode/document/schema/4.0`; v2, v3.0, and
v3.1 schema exports remain available and unchanged.

Layer IDs are unique within a v4 frame and identify logical layers across frames.
Historical duplicates receive deterministic numeric replacements. Handle
`LAYER_ID_REASSIGNED` warnings, including their optional original input paths.
See the [migration algorithm](specification-4.0.md#historical-migration).

`maxLayers` now applies per frame. Add `maxFrames` and `maxTotalLayers` as needed;
`maxCells` remains cumulative over the entire document. The defaults are protocol
budgets, not promises about an editor's capacity. Count repeated snapshots in full.
See the [limit table](specification-4.0.md#validation-budgets-and-compatibility).

No encoder API is needed: use `JSON.stringify()` for canonical output. Producers
can still write hexadecimal or RGBA wire colors. Keep `application/json` and the
`.json` or `.textmode.json` suffix. A sequence is one JSON object, not concatenated
JSON objects or an array of separate documents.

## Consumer requirements

### textmode.export.js

Collect each captured snapshot as a frame in one document. For a fixed capture
rate, use `durationMs: 1000 / frameRate` without rounding. Frame-local stacks can
change as the sketch runs. Keep metadata at the document root. JSON capture must
produce one JSON artifact; retain ZIP sequences for other formats.

### export.textmode.art

Export the selected sequence as one JSON artifact. Derive each duration from the
actual capture schedule, including variable source-frame durations and the final
selected interval. Do not replace source timing with a nominal FPS. Update file
extensions, estimates, progress reporting, and cumulative cell-budget checks.

### create.textmode.art

Use the same artwork decoder and serializer for stills and animations. Map layer
IDs to the editor's document-wide layers and frame cels. Missing layers must not
show inherited content. Check changing stack order, grid metrics, fonts, and
presentation before committing an import.

The current project format also stores history, palettes, custom-font resources,
names, locks, selections, and other application state. V4 does not replace that
complete persistence contract without data loss. Keep its project reader where
needed to recover those values. A unified artwork exchange path can use v4 while
application-specific persistence remains separate.

The editor currently rounds durations to whole milliseconds and limits frames,
layers, and grids. Support fractional timing or offer an explicit conversion;
do not silently round or clamp valid protocol input.

### textsprite

Update the independent Lua codec and Aseprite adapter. An npm package update only
updates its development oracle; released extensions do not run JavaScript.
Convert Aseprite frame durations from seconds to milliseconds and back. Map each
frame-local stack to native layers and cels. An absent layer must remain blank.

Native document-wide layers cannot necessarily represent arbitrary per-frame
stack order, fonts, or presentation. Validate the complete import before mutation.
Report unsupported meaningful data and require an explicit conversion when
needed. Retain rollback and cancellation behavior.

## Shared compatibility limits

Create and Aseprite have document-wide layer models. Stable IDs assist mapping,
but do not guarantee native representation of every valid v4 sequence. Consumers
must report unsupported meaningful data rather than silently dropping frames,
rounding timing, or changing presentation. Wholly blank files require dimensions
from the receiving application or user.

Dense JSON can be substantially larger than a compressed archive. Apply byte
limits before reading/parsing, then whole-document budgets during decoding.
Keep cancellation and worker policies in consumers; the reference decoder is
synchronous. JSON export does not imply bounded streaming serialization.

Existing ZIP sequences require consumer-side extraction and assembly. Their
manifest or source schedule supplies timing. ZIP parsing, archive migration,
renderer capture, and media encoding do not belong in this package.

## Release order and validation

1. Release the protocol package with the v4 schema, decoder, types, and guides.
2. Update and deploy compatible readers in the apps. Rebuild and install the
   Textsprite extension with its Lua reader. Verify all historical imports.
3. Enable v4 writers in the exporter and applications. Update supported package
   ranges and prevent earlier readers from receiving v4 until they are ready.
4. Verify real downloaded files across consumers, including fractional timing,
   missing layers, blank frames, font matching, unsupported-feature reporting,
   and application limits. Keep legacy project readers where required.

Run `npm run check` before release. It checks schema/decoder contracts, canonical
oracles, examples, type exports, package installation, and operation without DOM
or renderer dependencies. Consumer builds and TypeScript/Lua conformance checks
are separate release gates; this package's tests do not prove app interoperability.
