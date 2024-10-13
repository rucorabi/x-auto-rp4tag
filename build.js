const esbuild = require('esbuild');
const { GasPlugin } = require('esbuild-gas-plugin');

esbuild
  .build({
    entryPoints: ['./src/entry.ts'],
    bundle: true,
    // minify: true,
    format: 'iife',
    platform: 'node',
    outfile: './dist/main.js',
    plugins: [GasPlugin],
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
