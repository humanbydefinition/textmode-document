import { readFileSync } from 'node:fs';

import { Ajv2020 } from 'ajv/dist/2020.js';
import type { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv2020({ validateFormats: true });
addFormats.default(ajv, { mode: 'full' });

export function compileSchema(version: '2.0' | '3.0' | '3.1' | '4.0'): ValidateFunction {
	const schema = JSON.parse(
		readFileSync(new URL(`../../schemas/${version}/schema.json`, import.meta.url), 'utf8')
	) as object;
	return ajv.compile(schema);
}
