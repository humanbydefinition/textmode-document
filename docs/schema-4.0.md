# Visual guide to document format 4.0

See the [specification](specification-4.0.md), [JSON Schema](../schemas/4.0/schema.json),
and [complete examples](consumer-guide.md#complete-still-document).

## Document structure

```mermaid
flowchart TD
    Document["textmode.document @ 4.0.0"] --> Frames["frames: nonempty, playback order"]
    Document -. optional .-> Metadata["metadata: timestamp and generator"]
    Frames --> Frame["Complete frame snapshot"]
    Frame --> Duration["durationMs: positive finite milliseconds"]
    Frame --> Layers["layers: bottom first; empty means blank"]
    Layers --> Layer["id: unique within this frame"]
    Layer --> Presentation["visible, opacity, blendMode, offsets, rotation"]
    Layer --> Grid["Independent grid and cell pixel metrics"]
    Layer --> Cells["object-rows-v1: complete dense cells"]
    Layer -. optional .-> Font["Full SFNT font identity"]
```

The same layer ID across frames denotes one logical layer. All values are stored
again in each snapshot. A layer can disappear, return, change position, or change
its grid, font, or presentation. No content is inherited. There is no root canvas.
Wholly blank documents need dimensions from the receiving application or user.

## Validation responsibilities

```mermaid
flowchart LR
    Input["Parsed value"] --> Version["Explicit version dispatch"]
    Version --> Shape["Required fields and local constraints"]
    Shape --> Counts["Preflight frames and layer counts"]
    Counts --> Rules["IDs, duration sums, safe products, cells, budgets"]
    Rules --> Output["New canonical v4 frames"]
    Rules --> Error["Failure with original input path"]
```

JSON Schema checks structure and local values. The decoder also checks ID
uniqueness within each frame, grid/row agreement, redundant coordinates,
well-formed Unicode, safe arithmetic, and cumulative budgets. Repeated logical
layers count as separate instances. Empty frames count toward the frame budget.

Canonical colors are RGBA objects. Cell rotation is normalized to [0, 360);
layer rotation and frame durations are preserved. Unknown ordinary properties
are omitted. Root `layers`, `target`, `layer`, `grid`, and `canvas` are rejected.

## Historical inputs

```mermaid
flowchart TD
    Old["v1, v2, v3.0, v3.1"] --> Validate["Original version rules and paths"]
    Validate --> Stack["Decoded layer stack"]
    Stack --> IDs["Repair duplicate historical IDs with warnings"]
    IDs --> Frame["One complete frame, durationMs = 100"]
    V4["Native v4 frames"] --> Strict["Reject duplicate IDs; no repair"]
    Frame --> Canonical["Canonical v4 document"]
    Strict --> Canonical
```

Older schema exports stay unchanged. Migration does not invent font references.
Apps must apply their own font, precision, layout, and feature policies after
decoding. See the [consumer compatibility requirements](specification-4.0.md#consumer-compatibility).
