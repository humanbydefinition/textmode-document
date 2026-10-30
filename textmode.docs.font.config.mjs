import { defineDocs } from '@textmode/docs';
import config from './textmode.docs.config.mjs';

// The shared API checker inspects only the first link entry point.
export default defineDocs({
	...config,
	linkEntryPoints: [{ path: 'src/font.ts', tsconfig: 'tsconfig.build.json' }],
});
