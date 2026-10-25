# Consumer guide

## Choose a decoder

Use `parseTextmodeDocumentJSON(text, options)` when you already know the file is a
textmode document. Use `parseJSON(text)` when several formats share a `.json`
extension, then route by the parsed object's `format` and pass it to
`decodeTextmodeDocument(value, options)`. A filename or MIME type is only a hint.

```js
import { parseJSON, decodeTextmodeDocument } from '@textmode/document';

const parsed = parseJSON(jsonText);
if (!parsed.ok) {
	console.error(parsed.error);
} else if (
	parsed.value !== null &&
	typeof parsed.value === 'object' &&
	!Array.isArray(parsed.value) &&
	['textmode.document', 'textmode.layer'].includes(parsed.value.format)
) {
	const result = decodeTextmodeDocument(parsed.value, {
		acceptLegacy: true,
		limits: { maxCells: 16384, maxLayers: 64 },
	});
	console.log(result);
} else {
	// Route other supported formats to the app's other decoders.
}
```

`parseJSON` uses native `JSON.parse`. It does not detect duplicate object keys;
the last value wins. Avoid duplicate keys when producing files. Syntax success
alone says nothing about whether a value is a valid textmode document.

## Handle results and budgets

Malformed input returns `{ ok: false, error }`. Errors contain `code`, `message`,
and an optional JSON path such as `$.layer.cells.rows[0][0].foreground`.

| Code                   | Meaning                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| `INVALID_JSON`         | The input is not valid JSON syntax.                               |
| `INVALID_DOCUMENT`     | A value or cross-field invariant is invalid.                      |
| `UNSUPPORTED_FORMAT`   | The discriminator is unsupported, or legacy decoding is disabled. |
| `UNSUPPORTED_VERSION`  | The format version is not explicitly supported.                   |
| `UNSUPPORTED_TARGET`   | The document shape is unsupported.                                |
| `UNSUPPORTED_ENCODING` | The cell encoding is unsupported.                                 |
| `LIMIT_EXCEEDED`       | A resource budget or safe numeric range is exceeded.              |

Successful results contain `document` and `warnings`. A migrated legacy file
returns `LEGACY_DOCUMENT_MIGRATED`. `acceptLegacy` defaults to `true`; set it to
`false` to reject textmode.layer v1. Supported textmode.document v2 remains readable
and returns `DOCUMENT_VERSION_MIGRATED`; all successful results use v3. App-specific failures, such as a missing
font or unsupported blend mode, belong to the app after protocol decoding.

Every configured limit must be a positive safe integer. Invalid configuration
throws `TypeError`; it is a programming error rather than a document failure.
Limits and their defaults are listed in the [specification](specification-3.0.md#validation-budgets-and-compatibility).

Check file bytes before reading. Parsing occurs before decoded-cell budgets can
apply, so `maxCells` does not cap JSON parsing memory or input bytes. Use lower
app-specific budgets and check cancellation between file read, decode, and import.
Large files can be decoded in a worker; the library itself is synchronous.

Decoding preserves known values subject to normalization. It omits unknown
properties, so decode-and-serialize is not a lossless round trip for extensions.
It also cannot add missing font identity or recreate post-processing.

## Use JSON Schema

Node 24 can import the schema with an import attribute:

```js
import schema from '@textmode/document/schema/3.0' with { type: 'json' };
```

Bundlers may use their own JSON import syntax. A filesystem-based tool can resolve
the same package subpath and read it locally. All schema references are local.

For example, with Ajv installed in the consumer:

```js
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import schema from '@textmode/document/schema/3.0' with { type: 'json' };

const ajv = new Ajv2020({ validateFormats: true });
addFormats(ajv, { mode: 'full' });
const validate = ajv.compile(schema);
```

Enable date-time format assertions to check timestamps. Schema validation checks
structure and local constraints; decoding also checks row/grid agreement,
coordinates, pixel extents, Unicode well-formedness, and resource budgets. A
schema-valid document can fail decoding. Configurable decoder budgets can also
differ from schema constraints: for example, a glyph limit above 64 does not
change the published schema's `maxLength: 64`.

## Complete single-layer document

A one-layer document uses the same layer structure as a stack. Font identity is
chosen by the receiving application.

```json
{
	"format": "textmode.document",
	"formatVersion": "3.0.0",
	"layers": [
		{
			"visible": true,
			"opacity": 1,
			"blendMode": "normal",
			"offsetX": 0,
			"offsetY": 0,
			"rotationZ": 0,
			"grid": {
				"cols": 1,
				"rows": 1,
				"cellWidth": 8,
				"cellHeight": 16
			},
			"id": "base",
			"cells": {
				"encoding": "object-rows-v1",
				"rows": [
					[
						{
							"x": 0,
							"y": 0,
							"character": "A",
							"foreground": "#ffffffff",
							"background": "#00000000",
							"transform": {
								"invert": false,
								"flipX": false,
								"flipY": false,
								"rotation": 0
							}
						}
					]
				]
			}
		}
	]
}
```

## Complete layer stack

A document contains one or more layers in stack order, bottom first.
Each layer has its own grid and presentation values. There is no root canvas or viewport; each layer defines its own grid.

```json
{
	"format": "textmode.document",
	"formatVersion": "3.0.0",
	"layers": [
		{
			"id": "base",
			"visible": true,
			"opacity": 1,
			"blendMode": "normal",
			"offsetX": 0,
			"offsetY": 0,
			"rotationZ": 0,
			"grid": {
				"cols": 1,
				"rows": 1,
				"cellWidth": 8,
				"cellHeight": 16
			},
			"cells": {
				"encoding": "object-rows-v1",
				"rows": [
					[
						{
							"x": 0,
							"y": 0,
							"character": "A",
							"foreground": "#ffffffff",
							"background": "#000000ff",
							"transform": {
								"invert": false,
								"flipX": false,
								"flipY": false,
								"rotation": 0
							}
						}
					]
				]
			}
		},
		{
			"id": "accent",
			"visible": true,
			"opacity": 0.5,
			"blendMode": "screen",
			"offsetX": 4,
			"offsetY": 0,
			"rotationZ": 15,
			"grid": {
				"cols": 1,
				"rows": 1,
				"cellWidth": 8,
				"cellHeight": 16
			},
			"cells": {
				"encoding": "object-rows-v1",
				"rows": [
					[
						{
							"x": 0,
							"y": 0,
							"character": "*",
							"foreground": "#ff000080",
							"background": "#00000000",
							"transform": {
								"invert": false,
								"flipX": true,
								"flipY": false,
								"rotation": 90
							}
						}
					]
				]
			}
		}
	]
}
```
