import { defineDocs } from '@textmode/docs';

export default defineDocs({
	tsconfig: 'tsconfig.build.json',
	examples: false,
	checks: { apiLinks: [], docstrings: ['function', 'method', 'accessor'], examples: ['function'] },
});
