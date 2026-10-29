# Test documents

These documents are derived from `textsprite/examples/textmode-tycoon.textmode.json`.
The unknown-font example keeps the full 64 × 64 artwork. The other examples use
a 24 × 24 crop. The two-layer examples split that crop across two layers; both
layers use the same grid and cell metrics.

| File                                   | Purpose                                                                | Expected result                                                                                                     |
| -------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `unknown-font.textmode.json`           | One layer with a fabricated, well-formed font identity.                | Schema and decoder accept it. An editor without that font can report or substitute the missing font.                |
| `invalid-font-id.textmode.json`        | One layer with a malformed font identity.                              | Schema and decoder reject it at `$.layers[0].font.id`.                                                              |
| `two-layers-known-font.textmode.json`  | Two layers with the reference document's font identity.                | Schema and decoder accept it and retain both layers in order.                                                       |
| `two-layers-mixed-fonts.textmode.json` | Two layers: the reference font and a fabricated, well-formed identity. | Schema and decoder accept it and retain both layers. An editor without the second font can report or substitute it. |

The reference font identity matches only the specific font bytes used in the
original document. A valid identity does not guarantee that a consuming editor
has the font, can substitute it, or supports every glyph. The example IDs made
of zeroes are deliberately fabricated; they are not references to bundled fonts.
These are manual demo inputs, including one intentionally invalid document.
