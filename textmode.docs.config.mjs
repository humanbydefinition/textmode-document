import { defineDocs } from '@textmode/docs';

export default defineDocs({
	tsconfig: 'tsconfig.build.json',
	entryPoints: ['src/index.ts', 'src/font.ts'],
	examples: false,
	checks: { apiLinks: [], docstrings: ['function', 'method', 'accessor'], examples: ['function'] },
});
