# Textmode document format 2.0

> Versioned v2 reference. Current v3 documentation is in the
> [v3 specification](specification-3.0.md) and [visual guide](schema-3.0.md).
> The current decoder validates these older shapes and migrates them to v3.

## Status

This specification defines `textmode.document@2.0.0`. Its [JSON Schema](../schemas/2.0/schema.json)
is also available as `@textmode/document/schema/2.0`. The schema's `$id` is an
identifier and does not guarantee a hosted download. Package and document versions
are independent.

Version 2 stores editable cell data. It does not store final rendered pixels,
post-processing, an editor project, or authored animation. For complete examples
of the current format, see the [consumer guide](consumer-guide.md).

## Encoding

A textmode document is a UTF-8 JSON object. Producers should follow the I-JSON
profile in RFC 7493:

- object member names are unique;
- integers remain within the interoperable safe range;
- non-finite numbers are not emitted;
- timestamps use an uppercase, timezone-qualified RFC 3339 representation.

The JavaScript parser uses `JSON.parse`, which keeps the last value for a
repeated key. It does not report duplicate keys.

The media type is `application/json`. `.textmode.json` is a suggested filename
suffix; existing exporter downloads use `.json` by default. Extensions and
media types are discovery hints; consumers must route a decoded object using
its `format` member.

## Root discriminator

Every v2 document contains:

```json
{
	"format": "textmode.document",
	"formatVersion": "2.0.0",
	"target": "selected"
}
```

`target` is an on-disk shape discriminator:

- `selected` contains one cell snapshot in `layer`;
- `all` contains a layer stack in `layers`.

It is not an instruction to an exporter and must not be extended with temporal
values such as `animation`. Authored animation requires a distinct document or
container format.

## Version compatibility

The version uses a SemVer-shaped identifier. Version 2 does not define reader
negotiation or a formal extension mechanism. Consumers must accept only explicitly
tested versions and migrations; an unknown `2.x` version is not automatically
compatible.

For a supported version, consumers ignore unknown ordinary fields. The decoder
omits them from canonical output, so reserialization does not preserve them.
Consumers reject unknown `format`, `target`, and `encoding` values because those
values change how to read the document.

Version 2 does not define `extensionsUsed`, `extensionsRequired`, extension
namespacing, or an extension registry. A later revision must define those
rules before claiming extension compatibility.

## Selected cell snapshot

The `selected` shape contains:

- legacy grid pixel extent in `canvas`;
- logical grid dimensions and cell metrics in `grid`;
- an informational source ID and complete cell rows in `layer`.

This shape is a cell snapshot, not a lossless layer document. It does not carry
visibility, opacity, blend mode, offsets, layer rotation, or font identity.

## Layer stack

The `all` shape contains one or more layers. Each layer includes:

- informational ID;
- visibility and opacity;
- blend mode name;
- x/y offsets and z rotation;
- logical grid and cell metrics;
- complete cell rows.

The order of `layers` is bottom-to-top stack order. The exporter emits the base
layer first, followed by user layers. There is no fixed format-level layer count;
the decoder enforces the configurable budget.

`id` is informational source identity, scoped to the source snapshot. It is not a
persistent identity across files. The v2 decoder does not require IDs to be unique;
consumers must not infer reference semantics from them.

Offsets are compositing offsets in pixels. In the textmode.js compositor, positive
x moves right and positive y moves down. `rotationZ` is clockwise degrees about
the layer's rectangular center; the center remains the rotation origin when an
offset is applied. The decoder preserves layer rotation without normalization.
Opacity is from 0 through 1 and multiplies the layer presentation independently
of cell alpha. Invisible layers retain their cell data.

The textmode.js exporter writes `normal`, `additive`, `multiply`, `screen`,
`subtract`, `darken`, `lighten`, `overlay`, `softLight`, `hardLight`, `colorDodge`,
`colorBurn`, `difference`, or `exclusion`. The wire schema and decoder accept any
nonempty bounded blend-mode name. Consumers must decide whether they support it
before presentation; unknown names are not silently converted to `normal`.

## Canvas field

The v2 field named `canvas` is the grid pixel extent, not necessarily the HTML
canvas or final output surface. Its values obey:

```text
canvas.width  = grid.cols × grid.cellWidth
canvas.height = grid.rows × grid.cellHeight
```

For an `all` document, the root extent is derived from the first layer's grid.
Consumers must not infer composite placement or clipping from this field.

The meaning of this field must not change within version 2.

## Cell encoding

Version 2 defines one encoding:

```json
{
	"encoding": "object-rows-v1",
	"rows": []
}
```

The encoding is dense and row-major:

- `rows.length` equals `grid.rows`;
- every row length equals `grid.cols`;
- a cell's `x` equals its array index within the row;
- a cell's `y` equals the row index;
- every grid coordinate is present, including transparent cells.

Consumers reject coordinate disagreement rather than silently repairing or
reordering cells.

## Glyph identity

`character` contains a non-empty, bounded, well-formed Unicode glyph string.
Vector fonts commonly use one Unicode scalar, while tileset maps may use an
extended grapheme cluster containing combining marks, variation selectors, or
zero-width joiners. Unpaired surrogates are invalid. The default codec budget
is 64 Unicode scalar values per glyph string.

No Unicode normalization is implied. Consumers preserve the string exactly and
apply product-specific representability rules after protocol decoding.

## Colors

Foreground and background colors use either:

- `#RRGGBB`, whose alpha is implicitly 255;
- `#RRGGBBAA`;
- `{ "r": 0, "g": 0, "b": 0, "a": 255 }` with integer channels from
  0 through 255.

The canonical decoder normalizes colors to RGBA channel objects.

A cell is visually empty only when both foreground and background alpha are
zero. A space with a visible background remains meaningful cell data.

## Transforms

Every cell contains:

- `invert`: boolean;
- `flipX`: boolean;
- `flipY`: boolean;
- `rotation`: finite degrees.

The canonical decoder normalizes rotation into `[0, 360)`. It therefore
normalizes both `360` and `-360` to `0` and `-90` to `270`.

Consumers must reject unsupported meaningful transforms instead of
approximating them. In particular, swapping foreground and background is not a
general replacement for inversion when alpha is present.

## Metadata

Metadata is optional and informational:

```json
{
	"createdAt": "2026-08-28T12:00:00.000Z",
	"generator": {
		"name": "textmode.export.js",
		"version": "1.8.1"
	}
}
```

`generator.name` identifies the producer and is not restricted to
`textmode.export.js`. If metadata is present, `createdAt` must be a real
calendar date and time in the uppercase, timezone-qualified RFC 3339 profile:
seconds are required, fractional seconds are optional, and leap seconds are
not supported in version 2. The decoder preserves valid timestamps as written.

Consumers must not use metadata to select executable behavior, fetch resources,
or bypass document validation.

## Safety limits

The shared codec enforces structural safety limits and accepts caller-supplied
budgets. Every override must be a positive safe integer; invalid configuration
throws `TypeError`. Invalid document data instead returns a typed failure.

| Limit                     | Default    | Counting rule                                              |
| ------------------------- | ---------- | ---------------------------------------------------------- |
| `maxCells`                | 16,777,216 | Cumulative cells across the document.                      |
| `maxLayers`               | 4,096      | Layers in an `all` document; selected has one snapshot.    |
| `maxLayerIdLength`        | 1,024      | UTF-16 code units per identifier.                          |
| `maxCharacterLength`      | 64         | Unicode scalar values per glyph string.                    |
| `maxMetadataStringLength` | 4,096      | UTF-16 code units per metadata string and blend-mode name. |

These budgets apply after JSON parsing and do not limit file bytes or parser
memory. The schema's glyph `maxLength` remains 64 even when an app raises the
decoder limit. Applications can also enforce their own feature and size limits.

Consumers should:

- check file bytes before reading;
- cap total layers and total decoded cells;
- use checked multiplication for grid dimensions;
- bound identifiers and metadata strings;
- parse large files away from latency-sensitive UI work;
- abort work when the owning import session is cancelled.

Documents never authorize URL fetching, font installation, or code execution.

## Legacy migration

The compatibility decoder recognizes:

- `textmode.layer@1.0.0` as a selected cell snapshot;
- `textmode.layer@1.1.0` as a layer stack.

The current decoder migrates both to canonical v3 output and returns
`LEGACY_DOCUMENT_MIGRATED`. Set `acceptLegacy: false` to reject these legacy files;
this does not disable v2 document support.

## JSON Schema and runtime decoder

The specification defines meaning and cross-field rules. The JSON Schema describes
structure for general tooling. The decoder also checks or applies:

- cross-field row and grid invariants;
- grid pixel extent equality;
- total resource budgets;
- well-formed and bounded glyph-string validation;
- rotation and color normalization;
- legacy migration;
- stable error codes and JSON paths.

## Required fields

| Object          | Required fields                                                                             | Optional fields |
| --------------- | ------------------------------------------------------------------------------------------- | --------------- |
| Selected root   | `format`, `formatVersion`, `target`, `canvas`, `grid`, `layer`                              | `metadata`      |
| All root        | `format`, `formatVersion`, `target`, `canvas`, `layers`                                     | `metadata`      |
| Canvas          | `width`, `height`                                                                           | None            |
| Grid            | `cols`, `rows`, `cellWidth`, `cellHeight`                                                   | None            |
| Selected layer  | `id`, `cells`                                                                               | None            |
| Stack layer     | `id`, `visible`, `opacity`, `blendMode`, `offsetX`, `offsetY`, `rotationZ`, `grid`, `cells` | None            |
| Cell collection | `encoding`, `rows`                                                                          | None            |
| Cell            | `x`, `y`, `character`, `foreground`, `background`, `transform`                              | None            |
| Transform       | `invert`, `flipX`, `flipY`, `rotation`                                                      | None            |
| Metadata        | `createdAt`, `generator`                                                                    | None            |
| Generator       | `name`, `version`                                                                           | None            |

Unknown ordinary members are allowed in all these objects but omitted by the
canonical decoder. All schema references are local. Timestamp validation needs
`date-time` format assertions enabled in the selected schema validator. The
schema alone does not enforce every decoder rule or configurable budget.

Version 2 has no font identity or embedded font assets. Glyph strings and cell
metrics cannot identify an exact font. It also has no editor history, project
preferences, authored frame timeline, or post-processing representation. An
importer must apply its own font and supported-feature policy.
