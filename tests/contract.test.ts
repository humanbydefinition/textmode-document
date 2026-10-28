import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';
import { decodeTextmodeDocument } from '../src/index.js';
import { compileSchema } from './support/schema.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const SCHEMA_PATH = 'schemas/2.0/schema.json';
const FIXTURE_ROOT = 'tests/fixtures';

const v2Fixtures = ['v2/selected.json', 'v2/selected-unicode-alpha-transforms.json', 'v2/all.json'] as const;

type MutableSelectedDocument = {
	format: string;
	formatVersion: string;
	target: string;
	metadata: { createdAt: string; generator: { name: string; version: string } };
	layer: { cells: { encoding: string; rows: { x: number }[][] } };
};

function readJSON(relativePath: string): unknown {
	return JSON.parse(readFileSync(path.join(ROOT, relativePath), 'utf8')) as unknown;
}

function readFixture(name: string): unknown {
	return readJSON(`${FIXTURE_ROOT}/${name}`);
}

function selectedFixture(): MutableSelectedDocument {
	return readFixture('v2/selected.json') as MutableSelectedDocument;
}

const validateV2 = compileSchema('2.0');

describe('textmode document contract', () => {
	it('declares the Draft 2020-12 schema identity', () => {
		const schema = readJSON(SCHEMA_PATH) as Record<string, unknown>;
		expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
		expect(schema.$id).toBe('https://textmode.art/schemas/textmode-document-2.0.schema.json');
		expect(schema.oneOf).toEqual(expect.any(Array));
	});

	it.each(v2Fixtures)('validates the v2 test document %s against the schema', (name) => {
		expect(validateV2(readFixture(name)), JSON.stringify(validateV2.errors)).toBe(true);
	});

	it.each([
		['v2/selected.json', 'selected', false],
		['v2/selected-unicode-alpha-transforms.json', 'selected', false],
		['v2/all.json', 'all', false],
		['legacy/selected-v1.json', 'selected', true],
		['legacy/all-v1.1.json', 'all', true],
	] as const)('decodes the canonical fixture %s', (fixturePath, target, isLegacy) => {
		const result = decodeTextmodeDocument(readFixture(fixturePath));
		expect(result.ok).toBe(true);
		if (!result.ok) return;

		expect(result.document.frames[0].layers.length).toBe(
			target === 'selected' || fixturePath.startsWith('legacy/') ? 1 : 2
		);
		expect(result.warnings[0].code).toBe(isLegacy ? 'LEGACY_DOCUMENT_MIGRATED' : 'DOCUMENT_VERSION_MIGRATED');
	});

	it.each([
		'not-a-date',
		'2026-02-30T12:00:00Z',
		'2026-09-21t12:00:00Z',
		'2026-09-21T12:00:00',
		'2026-09-21T12:00:60Z',
	])('rejects invalid timestamp %s in schema and decoder', (timestamp) => {
		const document = selectedFixture();
		document.metadata.createdAt = timestamp;
		expect(validateV2(document)).toBe(false);
		expect(decodeTextmodeDocument(document)).toMatchObject({
			ok: false,
			error: { code: 'INVALID_DOCUMENT', path: '$.metadata.createdAt' },
		});
	});

	it('accepts a valid offset timestamp and another producer', () => {
		const document = selectedFixture();
		document.metadata.createdAt = '2026-02-28T12:34:56+02:00';
		document.metadata.generator.name = 'another.textmode.app';
		expect(validateV2(document)).toBe(true);
		const result = decodeTextmodeDocument(document);
		expect(result.ok).toBe(true);
		if (result.ok) expect(result.document.metadata).toEqual(document.metadata);
	});

	it.each(['format', 'formatVersion', 'target', 'encoding', 'generator'])('rejects invalid %s values', (field) => {
		const document = selectedFixture();
		if (field === 'format') document.format = 'another.format';
		if (field === 'formatVersion') document.formatVersion = '2.1.0';
		if (field === 'target') document.target = 'animation';
		if (field === 'encoding') document.layer.cells.encoding = 'packed-v2';
		if (field === 'generator') document.metadata.generator.name = '';
		expect(validateV2(document)).toBe(false);
		expect(decodeTextmodeDocument(document).ok).toBe(false);
	});

	it('leaves cross-field and budget checks to the decoder', () => {
		const document = readFixture('v2/all.json');
		expect(validateV2(document)).toBe(true);
		expect(decodeTextmodeDocument(document, { limits: { maxCells: 2 } })).toMatchObject({
			ok: false,
			error: { code: 'LIMIT_EXCEEDED' },
		});

		const wrongCoordinate = selectedFixture();
		wrongCoordinate.layer.cells.rows[0][0].x = 1;
		expect(validateV2(wrongCoordinate)).toBe(true);
		expect(decodeTextmodeDocument(wrongCoordinate)).toMatchObject({
			ok: false,
			error: { code: 'INVALID_DOCUMENT', path: '$.layer.cells.rows[0][0]' },
		});
	});

	it('keeps the Unicode fixture’s odd/even grid, alpha, Unicode, transforms, and empty-cell semantics', () => {
		const result = decodeTextmodeDocument(readFixture('v2/selected-unicode-alpha-transforms.json'));
		expect(result.ok).toBe(true);
		if (!result.ok) return;

		expect(result.document.frames[0].layers[0].grid).toMatchObject({ cols: 3, rows: 2 });
		const cells = result.document.frames[0].layers[0].cells.rows.flat();
		expect(cells).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					character: '😀',
					background: { r: 0, g: 0, b: 255, a: 96 },
					transform: expect.objectContaining({ flipX: true, rotation: 0 }),
				}),
				expect.objectContaining({
					character: 'é',
					transform: expect.objectContaining({ flipX: true, flipY: true, rotation: 45 }),
				}),
				expect.objectContaining({
					character: ' ',
					background: { r: 18, g: 52, b: 86, a: 255 },
				}),
				expect.objectContaining({
					character: 'X',
					foreground: { r: 0, g: 0, b: 0, a: 0 },
					background: { r: 0, g: 0, b: 0, a: 0 },
				}),
			])
		);
	});
});
