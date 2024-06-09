import dts from 'bun-plugin-dts'

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  minify: false,
  plugins: [dts()],
  external: [
    '@figureland/mathkit',
    '@figureland/typekit',
    '@figureland/statekit',
    '@figureland/toolkit',
    'superjson'
  ]
})
