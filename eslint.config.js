import config from '@textmode/lint';

export default config.map((entry) =>
	entry.files
		? {
				...entry,
				files: ['src/**/*.ts', 'tests/**/*.ts'],
				languageOptions: { ...entry.languageOptions, globals: {} },
			}
		: entry
);
