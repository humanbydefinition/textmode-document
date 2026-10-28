# Release format 3.1 support

This checkout uses npm-managed local dependencies while the new interfaces are
unpublished. `npm install` resolves them from adjacent project directories. Do not
publish a package with a local `file:` runtime dependency.

Publish compatible readers before applications write format 3.1:

1. Publish the renderer source-data interface (prepared as `0.19.0-dev.0`).
   Keep its release note about `loadFont()` returning a replacement instance.
2. Publish the document reader and font helper as the next major package release
   (prepared as `2.0.0-dev.0`). It reads 3.1, 3.0, v2, and the supported legacy
   formats. The 3.0 schema stays unchanged.
3. Update consumer dependencies to the published document reader and renderer.
   Deploy Create and Textsprite readers before distributing 3.1 writers.
4. Publish the exporter as the next major release (prepared as `2.0.0-dev.0`).
   Replace its local document dependency with the published npm version. Set its
   renderer peer minimum to the release that provides `TextmodeFont.sourceData`.
5. Replace the apps’ local dependencies with those registry versions and deploy
   the updated writers. Rebuild and install Textsprite.

The document format version is `3.1.0`; it is independent of npm package versions.
Existing export calls need no parameters or registration. The root decoder stays
independent of font-processing code; hashing is imported only from the font subpath.

Before release, run the package checks, application builds and export tests, and
Textsprite's portable, installed-extension, and font-identity tests. Keep the full
font golden vectors. Confirm that no runtime dependency in a publishable package
uses `file:` and that all required versions exist on npm.
