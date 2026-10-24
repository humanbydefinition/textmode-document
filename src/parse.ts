import type { JSONParseResult } from './types/index.js';

/**
 * Parse JSON syntax before routing the resulting value by its format discriminator.
 *
 * @example
 * ```ts
 * import { parseJSON } from '@textmode/document';
 * const parsed = parseJSON('{"format":"textmode.document"}');
 * if (parsed.ok) console.log(parsed.value);
 * ```
 */
export function parseJSON(json: string): JSONParseResult {
	try {
		return { ok: true, value: JSON.parse(json) as unknown };
	} catch (error) {
		return {
			ok: false,
			error: {
				code: 'INVALID_JSON',
				message: error instanceof Error ? error.message : 'The file is not valid JSON.',
			},
		};
	}
}
