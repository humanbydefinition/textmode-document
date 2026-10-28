import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { decodeTextmodeDocument, parseTextmodeDocumentJSON } from '../src/index.js';
import { compileSchema } from './support/schema.js';

const guide = readFileSync(new URL('../docs/consumer-guide.md', import.meta.url), 'utf8');
const validate = compileSchema('4.0');
const examples = [...guide.matchAll(/```json\n([\s\S]*?)\n```/g)].map((match) => match[1]);

describe('complete consumer-guide documents', () => {
	it('contains complete still, variable-layer animation, and blank examples', () => {
		expect(examples).toHaveLength(3);
		expect(
			examples.map((json) =>
				(JSON.parse(json) as { frames: { layers: unknown[] }[] }).frames.map((frame) => frame.layers.length)
			)
		).toEqual([[1], [2, 1, 0, 2], [0]]);
	});
	it.each(examples)('validates and decodes the documented file', (json) => {
		const value: unknown = JSON.parse(json);
		expect(validate(value), JSON.stringify(validate.errors)).toBe(true);
		expect(decodeTextmodeDocument(value).ok).toBe(true);
		expect(parseTextmodeDocumentJSON(json).ok).toBe(true);
	});
});
