# @textmode/document

<div align="center">

<img alt="@textmode/document, portable textmode documents" src=".github/assets/readme-og.png" />

| [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![JSON Schema Draft 2020-12](https://img.shields.io/badge/JSON_Schema-Draft_2020--12-85EA2D?logo=json&logoColor=white)](https://json-schema.org/draft/2020-12) | [![docs](https://img.shields.io/badge/docs-vitepress-646cff?logo=vitepress&logoColor=white)](https://code.textmode.art/) [![Discord](https://img.shields.io/discord/1357070706181017691?color=5865F2&label=Discord&logo=discord&logoColor=white)](https://discord.gg/sjrw8QXNks) | [![Ko-fi](https://shields.io/badge/ko--fi-donate-ff5f5f?logo=ko-fi)](https://ko-fi.com/V7V8JG2FY) [![GitHub Sponsors](https://img.shields.io/badge/sponsor-30363D?logo=GitHub-Sponsors&logoColor=%23EA4AAA)](https://github.com/sponsors/humanbydefinition) |
| :--- | :--- | :--- |

</div>

`@textmode/document` defines a portable, versioned JSON format for textmode artwork. It provides a language-neutral specification, JSON Schema, TypeScript types, and a dependency-free decoder for browsers and Node.js.

The package defines a unified `textmode.document@3.0.0` structure and reads v2 plus `textmode.layer@1.0.0` and `textmode.layer@1.1.0`. The package version and document format version are independent. Updating this library does not change existing files.

## Install

This checkout prepares unpublished v3 support. From a sibling consumer project,
install the local package with npm:

```sh
npm install ../textmode-document
```

The JavaScript interface is ESM-only and has no runtime dependencies. It does not require `textmode.js`, a renderer, DOM globals, or media encoders.

## Decode a document

```js
import { parseTextmodeDocumentJSON } from '@textmode/document';

const result = parseTextmodeDocumentJSON(jsonText, {
	limits: { maxCells: 65536, maxLayers: 64 },
});

if (!result.ok) {
	console.error(result.error.code, result.error.path, result.error.message);
} else {
	console.log(result.document.layers.length, result.warnings);
}
```

Successful decoding returns a new canonical document. Colors use RGBA objects, cell rotations use `[0, 360)`, and unknown properties are omitted. Apply each app's supported-feature policy after decoding.

## Documentation

- [Consumer guide](docs/consumer-guide.md): parsing, schema imports, error handling, resource budgets, and complete examples.
- [Format 3.0 specification](docs/specification-3.0.md): the language-neutral contract for producers and consumers.
- [JSON Schema visual guide](docs/schema-3.0.md): diagrams of document shapes, layers, cells, and validation responsibilities.
- [Maintenance guide](docs/maintenance.md): ownership, compatibility, tests, and release policy.
- [JSON Schema](schemas/3.0/schema.json): also available from `@textmode/document/schema/3.0`.

The schema identifier is an identifier. It does not promise that the schema is hosted at that URL. Test fixtures are private test data. They are not package exports and are excluded from npm packages.

## Contributing

Thank you for considering a contribution to this project.

Read the [Contributing Guide](./CONTRIBUTING.md) to get started.

## License

`@textmode/document` is dedicated to the public domain under [CC0 1.0 Universal](./LICENSE).

## Local v3 development

This checkout prepares unpublished package version `2.0.0-dev.0`. Keep sibling
checkouts of `textmode-document`, `textmode.export.js`, `create.textmode.art`, and
`export.textmode.art`. Build this package first, then the exporter, then the apps.
Consumers use npm `file:../textmode-document` directory dependencies; run npm
install in each repository after rebuilding dependencies. Do not publish these
local dependency manifests. Downstream CI using these local dependencies requires
the same sibling layout.

The [v2 specification](docs/specification-2.0.md) and schema import
`@textmode/document/schema/2.0` remain available for existing files.
