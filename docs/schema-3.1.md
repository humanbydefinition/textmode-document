# Visual guide to document format 3.1

This is a historical wire-format reference. The current decoder returns [v4 frames](specification-4.0.md) for every supported input.
These diagrams show the structure of `textmode.document@3.1.0`. For the complete
rules, see the [specification](specification-3.1.md) and [JSON Schema](../schemas/3.1/schema.json).
The [consumer guide](consumer-guide.md) includes complete example documents.

## One shape for any layer count

```mermaid
flowchart TD
    Document["Document object"] --> Format["format = textmode.document"]
    Document --> Version["formatVersion = 3.1.0"]
    Document --> Layers["layers[]: at least one; bottom to top"]
    Document -. optional .-> Metadata["metadata: createdAt + generator"]
    Layers --> Layer["Same complete layer structure for every entry"]
    Layer --> Identity["id: informational string"]
    Layer --> Presentation["visible, opacity, blendMode<br/>offsetX, offsetY, rotationZ"]
    Layer --> Grid["grid: cols, rows, cellWidth, cellHeight"]
    Layer --> Cells["cells: encoding + dense rows"]
```

All shown fields are required except metadata. A document with one layer has one
array entry. Root `target`, `layer`, `grid`, and `canvas` fields are rejected.
Other unknown fields are accepted and omitted from canonical output. IDs need not
be unique. The format does not define a font, viewport, or animation.

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

Every grid position is stored, including transparent cells. Layers can have
different dimensions and cell sizes. The decoder checks row sizes and coordinates
against each layer's grid.

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
    Decoder --> Success["Success: canonical v4 frames<br/>RGBA colors; normalized cell rotation"]
    Decoder --> Failure["Failure: code, message, optional path"]
    Success --> Warnings["Migration warnings for older input"]
```

The decoder checks documents directly; a separate schema validation pass is
optional. It omits unknown fields from canonical output. Applications must check
input size before parsing and apply their own font, feature, and placement rules.
See the [specification](specification-3.1.md#validation-budgets-and-compatibility)
for default limits and the [v2 visual guide](schema-2.0.md) for older shapes.

## Optional font reference

Each layer can include a `font` object. Its `id` is the full normalized SFNT
fingerprint; `name` is optional display text. References never embed a font or
require a local match during decoding. See the
[identity rules](specification-3.1.md#font-identity).

```mermaid
flowchart LR
    layer[Layer] --> font[Optional font]
    font --> id[Required full SHA-256 identity]
    font --> name[Optional display name]
```
