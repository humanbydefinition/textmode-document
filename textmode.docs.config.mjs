import { defineDocs } from '@textmode/docs';

export default defineDocs({
	examples: false,
	checks: { apiLinks: [], docstrings: ['function', 'method', 'accessor'], examples: ['function'] },
});
