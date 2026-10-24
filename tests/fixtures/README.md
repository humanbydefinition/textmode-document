# Private document test data

A fixture is fixed input for an automated test. These files retain the original
JSON bytes from `textmode.export.js` so an extraction or refactor cannot silently
change the compatibility baseline.

| File | Purpose |
| --- | --- |
| `v2/selected.json` | Selected snapshot, metadata, colors, and Unicode. |
| `v2/all.json` | Ordered layer stack, independent grids, presentation, and cumulative budgets. |
| `v2/selected-unicode-alpha-transforms.json` | Odd/even grid dimensions, glyph strings, alpha, transforms, and meaningful empty cells. |
| `legacy/selected-v1.json` | Migration from `textmode.layer@1.0.0`. |
| `legacy/all-v1.1.json` | Migration from `textmode.layer@1.1.0`. |

The Unicode fixture was formerly named `textmode-document-create-integration-v2`.
It checks protocol semantics; it does not prove an app integration works.

Do not use these files as public examples or package imports. They are excluded
from npm packages. To add coverage, prefer a focused test or a new small fixture;
change existing baseline values only when a documented protocol decision requires
it. Consumer examples live in the consumer guide and are validated separately.
