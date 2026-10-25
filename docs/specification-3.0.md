# Textmode document format 3.0

## Status and scope

This specification defines `textmode.document@3.0.0`, maintained in
`@textmode/document`. The npm package version is independent of the document
version. The [schema](../schemas/3.0/schema.json) uses Draft 2020-12 and is
available from `@textmode/document/schema/3.0`. Its `$id` is an identifier, not a
promise of a hosted download URL.

The format stores editable cell snapshots and ordered layers. Font identity,
font assets, a document viewport, authored animation, editor project state,
history, and post-processing are not represented.

## Encoding and root

Files are UTF-8 JSON objects. Producers should use unique object keys, safe-range
integers, finite numbers, and uppercase timezone-qualified timestamps. Native
`JSON.parse` does not detect duplicate keys; the last value wins. No duplicate-key
detection is claimed. Filename suffix `.textmode.json` and MIME type
`application/json` are hints; readers route by `format` and `formatVersion`.

The root requires `format: "textmode.document"`, `formatVersion: "3.0.0"`, and
`layers`. Optional `metadata` is defined below. `layers` is a nonempty array in
bottom-to-top order; there is no separate single-layer shape. Root `target`,
`layer`, `grid`, and `canvas` are obsolete and invalid, including when null.

Unknown ordinary object fields are allowed except these reserved root fields.
The canonical decoder creates a new object and omits unknown fields. Decoding
and reserializing does not preserve future extensions. Unknown tagged values of
`format`, `formatVersion`, and cell `encoding` are rejected. Accept only explicitly
supported versions; v3 does not define negotiation, required extensions, an
extension registry, or automatic support for future 3.x versions.

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

Every `grid` requires positive safe integers `cols`, `rows`, `cellWidth`, and
`cellHeight`. Cell count and grid pixel products must remain safe integers.
Layers may have different grids. There is no root-grid inheritance or viewport
inference. A layer's pixel extent is `cols × cellWidth` by `rows × cellHeight`.

## Cells and coordinates

Every `cells` object requires `encoding: "object-rows-v1"` and `rows`.
`rows.length` equals `grid.rows`; each row length equals `grid.cols`. Every cell,
including transparent cells, is present. A cell requires `x`, `y`, `character`,
`foreground`, `background`, and `transform`.

Coordinates are zero-based nonnegative safe integers. For `rows[y][x]`, the
stored coordinates must equal x and y. Consumers reject disagreement rather than
repair or reorder cells. These cross-field checks are enforced by the decoder.

## Glyphs, colors, and transforms

`character` is a nonempty well-formed Unicode glyph string. It can contain a
combining sequence or a joined emoji; it need not be one scalar value. Preserve
it without Unicode normalization. Unpaired surrogates are invalid. The schema
uses `minLength: 1` and `maxLength: 64`; the default decoder limit is 64 Unicode
scalar values. Caller budgets do not alter the published schema.

Each color is `#RRGGBB`, `#RRGGBBAA`, or an object with required integer `r`, `g`,
`b`, and `a` channels in [0, 255]. Six-digit notation implies alpha 255. Channels
are unpremultiplied; alpha 0 is transparent and 255 is opaque. Canonical output
uses RGBA channel objects. A space with visible background remains meaningful;
a cell is visually empty only when both foreground and background alpha are zero.

Every transform requires boolean `invert`, `flipX`, and `flipY`, plus finite
`rotation` in degrees. Canonical cell rotation is normalized to [0, 360): -90
becomes 270 and 360 becomes 0. Layer rotation is preserved separately. Swapping
colors is not a general substitute for inversion in the presence of alpha.
Consumers must reject unsupported meaningful transforms rather than approximate
them without an explicit product operation.

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
meaning. The decoder additionally enforces row/grid agreement, redundant
coordinates, safe products, well-formed Unicode, caller budgets, and canonical
normalization. A schema-valid document may fail decoding.

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
