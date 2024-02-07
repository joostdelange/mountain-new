import { build, BuildOptions } from 'esbuild';

const defaultOptions: BuildOptions = {
  bundle: true,
  minify: true,
  platform: 'node',
  external: ['pg-native', '@aws-sdk/*'],
};

(async() => {
  const handlerFiles = ['api.ts'];

  await build({
    ...defaultOptions,
    entryPoints: handlerFiles.map((file) => `./packages/backend/handlers/${file}`),
    outdir: './packages/backend/handlers/dist',
  });

  console.log(`Files bundled: ${handlerFiles.join(', ')}`);
})();