import dts from 'bun-plugin-dts'

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  minify: false,
  external: [
    // '@figureland/mathkit',
    // '@figureland/typekit',
    // '@figureland/statekit',
    // '@figureland/toolkit',
    'superjson'
  ]

  // plugins: [dts()]
})
