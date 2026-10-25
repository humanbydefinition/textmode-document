import { readFileSync } from 'node:fs';
import { Ajv2020 } from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { describe, expect, it } from 'vitest';
import { decodeTextmodeDocument, parseTextmodeDocumentJSON } from '../src/index.js';

const guide = readFileSync(new URL('../docs/consumer-guide.md', import.meta.url), 'utf8');
const schema = JSON.parse(readFileSync(new URL('../schemas/3.0/schema.json', import.meta.url), 'utf8')) as object;
const ajv = new Ajv2020({ validateFormats: true });
addFormats.default(ajv, { mode: 'full' });
const validate = ajv.compile(schema);
const examples = [...guide.matchAll(/```json\n([\s\S]*?)\n```/g)].map((match) => match[1]);

describe('complete consumer-guide documents', () => {
	it('contains examples for single-layer and stack documents', () => {
		expect(examples).toHaveLength(2);
		expect(examples.map((json) => (JSON.parse(json) as { layers: unknown[] }).layers.length)).toEqual([1, 2]);
	});
	it.each(examples)('validates and decodes the documented file', (json) => {
		const value: unknown = JSON.parse(json);
		expect(validate(value), JSON.stringify(validate.errors)).toBe(true);
		expect(decodeTextmodeDocument(value).ok).toBe(true);
		expect(parseTextmodeDocumentJSON(json).ok).toBe(true);
	});
});
