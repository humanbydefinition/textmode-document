import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const temporary = mkdtempSync(path.join(tmpdir(), 'textmode-document-package-'));
try {
	const [packed] = JSON.parse(
		execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], {
			cwd: root,
			encoding: 'utf8',
		})
	);
	assert(packed.files.every(({ path: name }) => !/(?:^|\/)(?:tests?|fixtures)(?:\/|\.)/.test(name)));
	assert(packed.files.every(({ path: name }) => !name.endsWith('.test.d.ts')));
	writeFileSync(path.join(temporary, 'package.json'), '{"private":true,"type":"module"}\n');
	// npm ci can cache dependency tarballs without caching the registry metadata
	// needed to resolve them in a new consumer project.
	execFileSync(
		'npm',
		[
			'install',
			'--ignore-scripts',
			'--prefer-offline',
			'--no-audit',
			'--no-fund',
			path.join(temporary, packed.filename),
		],
		{ cwd: temporary, stdio: 'pipe' }
	);
	writeFileSync(
		path.join(temporary, 'check.mjs'),
		`import assert from 'node:assert/strict';
import * as protocol from '@textmode/document';
import schema from '@textmode/document/schema/3.0' with { type: 'json' };
import v31Schema from '@textmode/document/schema/3.1' with { type: 'json' };
import currentSchema from '@textmode/document/schema/4.0' with { type: 'json' };
import { identifySfntFont } from '@textmode/document/font';
assert.equal(v31Schema.properties.formatVersion.const, '3.1.0');
assert.equal(currentSchema.$id, 'https://textmode.art/schemas/textmode-document-4.0.schema.json');
assert.equal(currentSchema.properties.formatVersion.const, '4.0.0');
assert.deepEqual(currentSchema.required, ['format', 'formatVersion', 'frames']);
assert.equal(identifySfntFont(new Uint8Array()).ok, false);
assert.equal(typeof globalThis.document, 'undefined');
assert.equal(typeof globalThis.window, 'undefined');
assert.equal(protocol.TEXTMODE_DOCUMENT_FORMAT_VERSION, '4.0.0');
const blank = { format: 'textmode.document', formatVersion: '4.0.0', frames: [{durationMs: 1000 / 60, layers: []}] };
assert.deepEqual(protocol.decodeTextmodeDocument(blank), { ok: true, document: blank, warnings: [] });
const historical = ${readFileSync(path.join(root, 'tests/fixtures/v3/single-layer.json'), 'utf8')};
const migrated = protocol.decodeTextmodeDocument(historical);
assert.equal(migrated.ok, true);
assert.equal(migrated.document.formatVersion, '4.0.0');
assert.equal(migrated.document.frames[0].durationMs, 100);
assert.equal('layers' in migrated.document, false);
assert.equal(protocol.parseTextmodeDocumentJSON('{').error.code, 'INVALID_JSON');
assert.equal(schema.$id, 'https://textmode.art/schemas/textmode-document-3.0.schema.json');
assert.equal(schema.type, 'object');
assert.deepEqual(schema.required, ['format', 'formatVersion', 'layers']);
const v2 = await import('@textmode/document/schema/2.0', {with: {type: 'json'}});
assert.equal(v2.default.oneOf.length, 2);
assert.equal('JSONCellCollection' in protocol, false);
assert.throws(() => import.meta.resolve('@textmode/document/fixtures/v2/selected.json'));
`
	);
	execFileSync(process.execPath, ['check.mjs'], { cwd: temporary, stdio: 'pipe' });
	const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
	assert.deepEqual(Object.keys(manifest.dependencies ?? {}), ['@noble/hashes']);
	assert.equal(Object.keys(manifest.peerDependencies ?? {}).length, 0);
	const source = readFileSync(path.join(root, 'src/index.ts'), 'utf8');
	const names = /export type \{([\s\S]*?)\} from/.exec(source)[1];
	writeFileSync(
		path.join(temporary, 'check.mts'),
		`export type { ${names} } from '@textmode/document';
import schema from '@textmode/document/schema/2.0';
import v3Schema from '@textmode/document/schema/3.0';
import v31Schema from '@textmode/document/schema/3.1';
import v4Schema from '@textmode/document/schema/4.0';
import type { TextmodeDocumentFrame, CanonicalTextmodeDocumentFrame, TextmodeDocumentJSON, TextmodeV3DocumentJSON, TextmodeV31DocumentJSON } from '@textmode/document';
const frame: TextmodeDocumentFrame = { durationMs: 1000 / 60, layers: [] };
const canonicalFrame: CanonicalTextmodeDocumentFrame = { durationMs: frame.durationMs, layers: [] };
const current: TextmodeDocumentJSON = { format: 'textmode.document', formatVersion: '4.0.0', frames: [canonicalFrame] };
// @ts-expect-error Canonical and latest wire documents have no root layers alias.
current.layers;
const old: TextmodeV3DocumentJSON = { format: 'textmode.document', formatVersion: '3.0.0', layers: [] };
const old31: TextmodeV31DocumentJSON = { ...old, formatVersion: '3.1.0' };
void old31;
void v31Schema.$id;
void v4Schema.$id;
const identity: unknown = schema.$id;
const v3Identity: unknown = v3Schema.$id;
void identity;
void v3Identity;
`
	);
	execFileSync(
		process.execPath,
		[
			path.join(root, 'node_modules/typescript/bin/tsc'),
			'--noEmit',
			'--strict',
			'--skipLibCheck',
			'false',
			'--module',
			'NodeNext',
			'--target',
			'ES2020',
			'--lib',
			'ES2020',
			'check.mts',
		],
		{ cwd: temporary, stdio: 'pipe' }
	);
	console.log('Packed ESM, schema, type exports, runtime isolation, and private-test exclusions passed.');
} finally {
	rmSync(temporary, { recursive: true, force: true });
}
