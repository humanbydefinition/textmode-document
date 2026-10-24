# @textmode/document

Portable textmode documents: a versioned JSON format, JSON Schema, TypeScript
types, and a dependency-free decoder. Use the same contract in browsers, Node.js,
and implementations written in other languages.

The package reads `textmode.document@2.0.0` and migrates
`textmode.layer@1.0.0` and `textmode.layer@1.1.0`. Package version `1.0.0` and
document version `2.0.0` are independent: updating a library does not change files.

## Installation

The package is prepared at version `1.0.0`; npm publication is deferred. Install
from the source repository for now:

```sh
npm install github:humanbydefinition/textmode-document
```

npm builds this Git dependency automatically. The exporter pins an exact source
commit for reproducible installs.

The JavaScript interface is ESM-only. It has no runtime dependencies and does not
require `textmode.js`, a renderer, DOM globals, or media encoders.

## Decode a document

```js
import { parseTextmodeDocumentJSON } from '@textmode/document';

const result = parseTextmodeDocumentJSON(jsonText, {
	limits: { maxCells: 65536, maxLayers: 64 },
});

if (!result.ok) {
	console.error(result.error.code, result.error.path, result.error.message);
} else {
	console.log(result.document.target, result.warnings);
}
```

Successful decoding returns a new canonical document: colors use RGBA objects,
cell rotations use `[0, 360)`, and unknown properties are omitted. Apply the
destination app's supported-feature policy after decoding.

## Documentation

- [Consumer guide](docs/consumer-guide.md): parsing, schema imports, error handling,
  resource budgets, and complete documents.
- [Format 2.0 specification](docs/specification-2.0.md): the language-neutral
  contract for producers and consumers.
- [Maintenance guide](docs/maintenance.md): ownership, compatibility, tests, and
  releases.
- [JSON Schema](schemas/2.0/schema.json): also available through the
  `@textmode/document/schema/2.0` package entry point.

The schema identifier is an identifier, not a promise of a hosted download.
Test fixtures are private implementation data. They are not package exports and
are excluded from npm packages.

## Development

Use Node 24 and npm. Run `npm ci`, then `npm run check`. The MIT-licensed
implementation was extracted from
[`textmode.export.js`](https://github.com/humanbydefinition/textmode.export.js).

## License

[MIT](LICENSE), copyright humanbydefinition. See the source repository history
and the retained license for attribution.
