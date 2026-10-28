# Textmode document format 3.1

## Status and scope

This specification defines `textmode.document@3.1.0`. The npm package version
is independent of the document version. The [JSON Schema](../schemas/3.1/schema.json)
uses Draft 2020-12 and is available as `@textmode/document/schema/3.1`. Its `$id`
is an identifier and does not guarantee a hosted download.

A document stores editable cells in ordered layers. It can reference a source font. It does not embed font files
or other assets, a viewport, animation, editor project state, history, or post-processing.

## Encoding and root

Files are UTF-8 JSON objects. Producers should use unique keys, safe integers,
finite numbers, and uppercase, timezone-qualified timestamps. JavaScript's
`JSON.parse` keeps the last value when a key is repeated; it does not report
duplicates. The `.textmode.json` suffix and `application/json` MIME type are hints.
Readers identify the format using `format` and `formatVersion`.

The root requires `format: "textmode.document"`, `formatVersion: "3.1.0"`, and
`layers`. Optional `metadata` is defined below. `layers` is a nonempty array in
bottom-to-top order; there is no separate single-layer shape. Root `target`,
`layer`, `grid`, and `canvas` are obsolete and invalid, including when null.

Unknown ordinary fields are allowed, except for the reserved root fields above.
The decoder omits unknown fields from its canonical output, so decoding and
reserializing does not preserve extensions. Readers reject unknown `format`,
`formatVersion`, and cell `encoding` values. Accept only explicitly supported
versions: v3 does not define version negotiation, required extensions, an
extension registry, or automatic compatibility with future 3.x versions.

## Layer structure and presentation

Every layer requires all fields below, including when it is the only layer:

| Field                | Meaning                                                                                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                 | Nonempty informational source ID; not a cross-file identity. Uniqueness is not enforced.                                                                          |
| `visible`            | Boolean; hidden cells remain stored.                                                                                                                              |
| `opacity`            | Number in [0, 1], independent of cell alpha.                                                                                                                      |
| `blendMode`          | Nonempty bounded name; unknown names are preserved. Apps choose which names they support.                                                                         |
| `offsetX`, `offsetY` | Finite pixel offsets; positive x is right and positive y is down in textmode.js.                                                                                  |
| `rotationZ`          | Finite degrees, clockwise about the layer's rectangular center in textmode.js. Offset does not change the local rotation origin. Preserved without normalization. |
| `grid`               | Independent logical dimensions and cell pixel metrics.                                                                                                            |
| `cells`              | Complete dense row-major cell data.                                                                                                                               |

The textmode.js producer names are `normal`, `additive`, `multiply`, `screen`,
`subtract`, `darken`, `lighten`, `overlay`, `softLight`, `hardLight`,
`colorDodge`, `colorBurn`, `difference`, and `exclusion`. These are not an enum
in the portable schema. Apps must not silently replace an unsupported meaningful
mode with `normal`.

Each `grid` requires positive safe integers for `cols`, `rows`, `cellWidth`, and
`cellHeight`. The cell count and pixel products must also be safe integers. Layers
can have different grids. A layer's pixel extent is `cols × cellWidth` by
`rows × cellHeight`. Do not infer a root grid or viewport.

## Cells and coordinates

Every `cells` object requires `encoding: "object-rows-v1"` and `rows`.
`rows.length` equals `grid.rows`; each row length equals `grid.cols`. Every cell,
including transparent cells, is present. A cell requires `x`, `y`, `character`,
`foreground`, `background`, and `transform`.

Coordinates are zero-based nonnegative safe integers. In `rows[y][x]`, the
cell's stored `x` and `y` must match its array position. Consumers must reject a
mismatch without repairing or reordering cells. The decoder enforces this rule.

## Glyphs, colors, and transforms

`character` is a nonempty, well-formed Unicode glyph string. It may contain
multiple scalar values, such as a combining sequence or joined emoji. Preserve it
without Unicode normalization. Unpaired surrogates are invalid. The schema uses
`minLength: 1` and `maxLength: 64`; the default decoder limit is 64 Unicode scalar
values. Changing a decoder limit does not change the published schema.

Each color is `#RRGGBB`, `#RRGGBBAA`, or an object with required integer `r`, `g`,
`b`, and `a` channels in [0, 255]. Six-digit notation implies alpha 255. Channels
are unpremultiplied; alpha 0 is transparent and 255 is opaque. Canonical output
uses RGBA channel objects. A space with visible background remains meaningful;
a cell is visually empty only when both foreground and background alpha are zero.

Each transform requires boolean `invert`, `flipX`, and `flipY` values and a finite
`rotation` in degrees. The decoder normalizes cell rotation to [0, 360): -90
becomes 270 and 360 becomes 0. Layer rotation is separate. Swapping colors is
not a general replacement for inversion when alpha is present. Consumers must
reject unsupported meaningful transforms rather than approximate them without an
explicit product operation.

## Metadata

Optional root `metadata`, when present, requires `createdAt` and `generator`.
`generator` requires nonempty bounded `name` and `version` strings and can
identify any producer. It does not select executable behavior.

`createdAt` is a real calendar date and time with uppercase T, required seconds,
a timezone, optional fractional seconds, and no leap seconds. Valid timestamps
are preserved as written. Enable date-time format assertions in JSON Schema
validators; format annotations alone are insufficient.

## Validation, budgets, and compatibility

The schema defines structure and local constraints. This specification defines
meaning. The decoder also checks row sizes, coordinates, safe products, Unicode,
and caller limits, and normalizes output. A schema-valid document may still fail
decoding.

| Decoder limit             |    Default | Counting rule                                              |
| ------------------------- | ---------: | ---------------------------------------------------------- |
| `maxCells`                | 16,777,216 | Cumulative across all layers.                              |
| `maxLayers`               |      4,096 | Layer count.                                               |
| `maxLayerIdLength`        |      1,024 | UTF-16 code units per ID.                                  |
| `maxCharacterLength`      |         64 | Unicode scalar values per glyph.                           |
| `maxMetadataStringLength` |      4,096 | UTF-16 code units per metadata string and blend-mode name. |

Every override must be a positive safe integer. Invalid configuration throws
`TypeError`; invalid document input returns a failure result. Budgets apply
after parsing and do not bound input bytes or parser memory. Apps must apply
appropriate byte caps before reading/parsing and their own font and feature
policy after protocol decoding. Documents do not authorize fetching resources,
font installation, or code execution.

Supported v2 files are validated under their original rules, including canvas
extent checks, before conversion. Selected v2 snapshots move their root grid
into one layer and receive visible=true, opacity=1, normal blending, and zero
offsets/rotation. V2 stacks preserve their layers. Both return
`DOCUMENT_VERSION_MIGRATED` and canonical v3 output.

Legacy `textmode.layer@1.0.0` and `textmode.layer@1.1.0` migrate to one or more
layers and return `LEGACY_DOCUMENT_MIGRATED`. `acceptLegacy: false` rejects these
textmode.layer files but still accepts supported textmode.document v2 files.
The [v2 specification](specification-2.0.md) and schema remain available; their
wire-format constraints are unchanged.

## Font identity

A layer can include `font`, an object with a required `id` and an optional `name`.
Explicit null is invalid for either field. Unknown ordinary fields are omitted.
The ID must match `^sfnt-v1-sha256:[0-9a-f]{64}$`. The name is nonempty,
well-formed Unicode display text, limited by `maxMetadataStringLength` (4,096
UTF-16 code units by default). Matching uses the complete ID alone. Decoding
never requires local font availability. Migration never invents a reference.

The ID identifies a normalized standalone SFNT revision, including all naming,
outlines, metrics, character maps, and timestamps. It is not a font family ID.
Font size, rendering settings, filenames, and external app labels do not affect it.

The canonical stream uses this exact sequence:

1. ASCII `textmode.font.sfnt.v1`, followed by one zero byte.
2. The four SFNT flavor bytes (`00010000`, `OTTO`, or `true`).
3. Included table count as an unsigned 16-bit big-endian integer.
4. Tables sorted by their four unsigned tag bytes. For each: the four tag bytes,
   the unsigned 32-bit big-endian data length, and the normalized table data.

Exclude `DSIG`. Zero bytes 8–11 (zero-based) in `head` (`checkSumAdjustment`).
Exclude directories, offsets, directory checksums, and external padding.
Preserve every other table byte. Hash the stream with SHA-256 and encode it as
lowercase hexadecimal after `sfnt-v1-sha256:`. Equivalent decoded WOFF and TTF
sources therefore match. A subset or modified embedded metadata does not.

The helper accepts at most 16 MiB and 256 tables. It rejects truncated
headers or directories, unsupported flavors, duplicate tags, out-of-bounds or
overlapping table ranges, and missing or short `head` data. Hash chunks are fed
incrementally. Name extraction is optional: use PostScript name ID 6, then full
font name ID 4, preferring English or Unicode records. Unreadable names do not
prevent identification.

Example identity: `sfnt-v1-sha256:82312690f7a5e14b7aea54a8232edf8a22bddefdbef880eae2fe653942ee9a96`.
A compact display label can be `UrsaFont-82312690f7a5`. Never persist the short
label in place of the complete ID. Keep resource-integrity hashes separate.

## Version 3.0 compatibility

The 3.0 schema remains unchanged. Readers explicitly accept 3.0 and normalize it
to 3.1 with `DOCUMENT_VERSION_MIGRATED`. A 3.0 `font` extension is an unknown
ordinary field and is omitted. References are defined only in 3.1. Deploy compatible
readers before enabling 3.1 writers. Earlier format migrations remain supported.
