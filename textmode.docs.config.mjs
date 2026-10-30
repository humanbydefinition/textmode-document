import { defineDocs } from '@textmode/docs';

export default defineDocs({
	tsconfig: 'tsconfig.build.json',
	entryPoints: ['src/index.ts', 'src/font.ts'],
	examples: false,
	typedoc: {
		categoryOrder: [
			'Parsing and decoding',
			'Document format',
			'Decoded documents',
			'Historical formats',
			'Format constants',
			'*',
		],
	},
	checks: { apiLinks: [], examples: ['function'] },
});
