# Visual guide to document format 3.0

These Mermaid diagrams explain the current [JSON Schema](../schemas/3.0/schema.json).
The [specification](specification-3.0.md) defines normative meaning; the
[consumer guide](consumer-guide.md) contains complete documents. The diagrams
are maintained documentation; review them with schema and specification changes.

## One shape for any layer count

```mermaid
flowchart TD
    Document["Document object"] --> Format["format = textmode.document"]
    Document --> Version["formatVersion = 3.0.0"]
    Document --> Layers["layers[]: at least one; bottom to top"]
    Document -. optional .-> Metadata["metadata: createdAt + generator"]
    Layers --> Layer["Same complete layer structure for every entry"]
    Layer --> Identity["id: informational string"]
    Layer --> Presentation["visible, opacity, blendMode<br/>offsetX, offsetY, rotationZ"]
    Layer --> Grid["grid: cols, rows, cellWidth, cellHeight"]
    Layer --> Cells["cells: encoding + dense rows"]
```

All shown members are required except metadata. A one-layer file has one array
entry. There is no root `target`, `layer`, `grid`, or `canvas`; those fields are
rejected. Unknown ordinary fields are accepted and omitted from canonical output.
IDs need not be unique. No font, viewport, or animation is inferred.

## Grids and storage

```mermaid
flowchart TD
    Grid["Layer grid: positive safe integers"] --> Extent["Derived pixel extent<br/>cols × cellWidth; rows × cellHeight"]
    Grid --> Encoding["cells.encoding = object-rows-v1"]
    Encoding --> Rows["cells.rows: grid.rows rows"]
    Rows --> Row["rows[y]: grid.cols cells"]
    Row --> Cell["rows[y][x]"]
    Cell --> Coordinates["cell.x = x; cell.y = y<br/>zero-based, redundant checks"]
    Grid -. "decoder checks safe products and array agreement" .-> Coordinates
```

Every grid position is stored, including fully transparent cells. Layers may
have different dimensions and metrics; there is no root-grid fallback. The
schema describes local shapes; the decoder checks array counts and coordinates.

## Layer presentation

```mermaid
flowchart LR
    Layer["Layer"] --> Visible["visible: boolean"]
    Layer --> Opacity["opacity: 0 to 1"]
    Layer --> Blend["blendMode: nonempty name"]
    Layer --> Offset["offsetX / offsetY: pixels<br/>positive right / down"]
    Layer --> Rotation["rotationZ: finite degrees<br/>clockwise about center in textmode.js"]
    Opacity --> Alpha["Multiplies layer appearance<br/>separate from cell alpha"]
    Blend --> Support["Unknown names preserved<br/>consumer checks support"]
```

Hidden layers keep their cells. Layer rotation is preserved without canonical
normalization. Stack order is bottom first. Every presentation field is explicit;
JSON Schema defaults are not used to supply missing values.

## Complete cell payload

```mermaid
flowchart TD
    Cell["Cell: all fields required"] --> XY["x / y: nonnegative safe integers"]
    Cell --> Glyph["character: nonempty Unicode glyph string"]
    Cell --> FG["foreground"]
    Cell --> BG["background"]
    FG --> Color{"Color representation"}
    BG --> Color
    Color --> RGB["#RRGGBB: alpha 255"]
    Color --> RGBAHex["#RRGGBBAA"]
    Color --> Channels["Object: integer r, g, b, a<br/>each 0 to 255"]
    Cell --> Transform["transform"]
    Transform --> Booleans["invert / flipX / flipY: booleans"]
    Transform --> Rotation["rotation: finite degrees<br/>canonical [0, 360)"]
```

Canonical colors use RGBA objects. Unicode is preserved without normalization;
unpaired surrogates fail. The schema's minLength/maxLength are 1/64; decoder
scalar-count budgets are configurable. A visible background on a space matters.
Only cells whose foreground and background alpha are both zero are visually
empty. Inversion cannot generally be replaced by swapping colors.

## Metadata

```mermaid
flowchart LR
    Document["Document"] -. optional .-> Metadata["metadata"]
    Metadata --> Date["createdAt: real date-time<br/>uppercase T + timezone + seconds"]
    Metadata --> Generator["generator"]
    Generator --> Name["name: nonempty producer string"]
    Generator --> Version["version: nonempty producer string"]
```

All children are required when metadata is present. Fractional seconds are
optional; leap seconds are unsupported. Enable date-time format assertions in
validators. Metadata is informational and never authorizes code or resource loads.

## Readers and canonical output

```mermaid
flowchart TD
    V3["v3: unified layers"] --> Decoder["Decode known fields<br/>enforce budgets + cross-field rules"]
    V2["v2: selected or all<br/>original validation including canvas"] --> Migration["Convert structure<br/>neutral presentation for selected snapshots"]
    V1["Legacy textmode.layer v1<br/>when acceptLegacy is true"] --> Migration
    Migration --> Decoder
    Decoder --> Success["Success: canonical v3 layers<br/>RGBA colors; normalized cell rotation"]
    Decoder --> Failure["Failure: code, message, optional path"]
    Success --> Warnings["Migration warnings for older input"]
```

The decoder does not require a schema-validator pass. It enforces the shared
rules directly; the specification and schema are independent references. Default
budgets are 16,777,216 cells, 4,096 layers, 1,024 UTF-16 units per ID, 64 scalar
values per glyph, and 4,096 UTF-16 units per metadata string or blend-mode name.
Invalid budgets throw TypeError; malformed data returns a failure. Parsing occurs
before those budgets apply. Apps enforce input-byte limits and supported fonts,
features, and placement. Unknown fields are omitted, so decoding is not an
extension-preserving round trip. See the [v2 visual guide](schema-2.0.md) for
older wire shapes.
