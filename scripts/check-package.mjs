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
	execFileSync(
		'npm',
		['install', '--ignore-scripts', '--offline', '--no-audit', '--no-fund', path.join(temporary, packed.filename)],
		{ cwd: temporary, stdio: 'pipe' }
	);
	writeFileSync(
		path.join(temporary, 'check.mjs'),
		`import assert from 'node:assert/strict';
import * as protocol from '@textmode/document';
import schema from '@textmode/document/schema/2.0' with { type: 'json' };
assert.equal(typeof globalThis.document, 'undefined');
assert.equal(protocol.TEXTMODE_DOCUMENT_FORMAT_VERSION, '2.0.0');
assert.equal(protocol.parseTextmodeDocumentJSON('{').error.code, 'INVALID_JSON');
assert.equal(schema.$id, 'https://textmode.art/schemas/textmode-document-2.0.schema.json');
assert.equal(schema.oneOf.length, 2);
assert.equal('JSONCellCollection' in protocol, false);
assert.throws(() => import.meta.resolve('@textmode/document/fixtures/v2/selected.json'));
`
	);
	execFileSync(process.execPath, ['check.mjs'], { cwd: temporary, stdio: 'pipe' });
	const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
	assert.equal(Object.keys(manifest.dependencies ?? {}).length, 0);
	assert.equal(Object.keys(manifest.peerDependencies ?? {}).length, 0);
	const source = readFileSync(path.join(root, 'src/index.ts'), 'utf8');
	const names = /export type \{([\s\S]*?)\} from/.exec(source)[1];
	writeFileSync(
		path.join(temporary, 'check.mts'),
		`export type { ${names} } from '@textmode/document';
import schema from '@textmode/document/schema/2.0';
const identity: unknown = schema.$id;
void identity;
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
