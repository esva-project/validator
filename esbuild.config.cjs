const esbuild = require('esbuild')

const catcher = (error) => {
  console.error(error)
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1)
}

const builder = () =>
  esbuild
    .build({
      bundle: true,
      entryPoints: ['src/server.ts'],
      external: ['./node_modules/*'],
      format: 'esm',
      metafile: true,
      minify: true,
      outdir: 'dist',
      platform: 'node',
      sourcemap: false,
      sourcesContent: false,
      target: 'node16'
    })
    .catch(catcher)
    .then((result) => esbuild.analyzeMetafile(result.metafile))
    .then(console.info)

builder()
