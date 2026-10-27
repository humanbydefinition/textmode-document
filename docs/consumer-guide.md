# Consumer guide

## Choose a decoder

Use `parseTextmodeDocumentJSON(text, options)` when you know the file is a
textmode document. If your app accepts several JSON formats, use `parseJSON(text)`
first. Check the parsed object's `format`, then pass textmode documents to
`decodeTextmodeDocument(value, options)`. A filename or MIME type alone cannot
identify the format.

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

`parseJSON` uses JavaScript's `JSON.parse`. If an object repeats a key, the last
value wins. Producers should use unique keys. Valid JSON is not necessarily a
valid textmode document.

## Handle results and budgets

Invalid input returns `{ ok: false, error }`. The error includes a `code`,
`message`, and sometimes a JSON path, such as `$.layer.cells.rows[0][0].foreground`.

| Code                   | Meaning                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| `INVALID_JSON`         | The input is not valid JSON syntax.                               |
| `INVALID_DOCUMENT`     | A value or cross-field invariant is invalid.                      |
| `UNSUPPORTED_FORMAT`   | The discriminator is unsupported, or legacy decoding is disabled. |
| `UNSUPPORTED_VERSION`  | The format version is not explicitly supported.                   |
| `UNSUPPORTED_TARGET`   | The document shape is unsupported.                                |
| `UNSUPPORTED_ENCODING` | The cell encoding is unsupported.                                 |
| `LIMIT_EXCEEDED`       | A resource budget or safe numeric range is exceeded.              |

Successful results contain a canonical v3 `document` and a `warnings` array.
Migrated `textmode.layer` v1 files return `LEGACY_DOCUMENT_MIGRATED`. Set
`acceptLegacy: false` to reject them; the default is `true`. Supported v2 and v3.0 files
remain readable and return `DOCUMENT_VERSION_MIGRATED`.

After decoding, your app must check its own requirements, such as available fonts
and supported blend modes. The decoder normalizes known values and omits unknown
properties, so decoding and serializing does not preserve extensions. The format
can identify the source font; it does not embed font files or store post-processing.

Set limits to positive safe integers. Invalid limit configuration throws
`TypeError`. See the [default limits](specification-3.1.md#validation-budgets-and-compatibility).

Check file size before reading: decoder limits apply after JSON parsing and do not
limit input bytes or parser memory. Choose budgets for your app and check for
cancellation between reading, decoding, and importing. The library is synchronous;
you can decode large files in a worker.

## Use JSON Schema

Node 24 can import the schema with an import attribute:

```js
import schema from '@textmode/document/schema/3.1' with { type: 'json' };
```

Bundlers may use different JSON import syntax. Tools that read files can resolve
the same package subpath. All references within the schema are local.

For example, with Ajv installed in the consumer:

```js
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import schema from '@textmode/document/schema/3.1' with { type: 'json' };

const ajv = new Ajv2020({ validateFormats: true });
addFormats(ajv, { mode: 'full' });
const validate = ajv.compile(schema);
```

Enable date-time format assertions to check timestamps. The schema checks
structure and local constraints. The decoder also checks relationships such as
row sizes and coordinates, plus Unicode and resource limits. A schema-valid file
can still fail decoding. Changing a decoder limit does not change the published
schema; for example, the schema's glyph `maxLength` remains 64.

## Complete single-layer document

A single-layer document uses the same structure as a layer stack. The receiving
application resolves the optional font reference or asks for a substitute.

```json
{
	"format": "textmode.document",
	"formatVersion": "3.1.0",
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

Layers appear in stack order, with the bottom layer first. Each layer has its own
grid and presentation values. The document has no root canvas or viewport.

```json
{
	"format": "textmode.document",
	"formatVersion": "3.1.0",
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

## Identify a font

Use the separate font entry point with decoded SFNT bytes. WOFF decoding belongs
to the font loader. Identification is synchronous and does not require a renderer.

```ts
import { identifySfntFont } from '@textmode/document/font';

const result = identifySfntFont(decodedSfntBytes);
if (result.ok) layer.font = result.font;
```

Match the complete `font.id`. Use `font.name` only for display. Missing references
remain valid. Do not infer an ID from a filename, app label, or glyph coverage.
See the [font identity contract](specification-3.1.md#font-identity).
