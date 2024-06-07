[![CI](https://github.com/figureland/infinitykit/actions/workflows/ci.yml/badge.svg)](https://github.com/figureland/infinitykit/actions/workflows/ci.yml)
[![NPM](https://img.shields.io/npm/v/@figureland/infinitykit?color=40bd5c)](https://img.shields.io/npm/v/@figureland/infinitykit?color=40bd5c)

**infinitykit** is a toolkit for building infinite canvas apps and experimental map interfaces.

The aim of this project is to provide a highly modular box of primitives that you can put together in whatever app or framework you want. The core logic isn't dependent on the DOM, so it makes it simple to render and interact with canvases programmatically on servers, Web Workers, OffscreenCanvas and so on. It tries not to make any many assumptions about how you render your canvas or the shape of your data.

While size wasn't the main priority, **infinitykit** is pretty small. It checks in at **5.37 kB** all in, minified and brotlied. It's written from scratch using only [figure](https://github.com/figureland) dependencies. For now, [SuperJSON](https://github.com/blitz-js/superjson) is also optionally a peer dependency, although the hope is that will be removed and replaced with something custom and more minimal in the future. You'll need that if you want to persist your canvas data to local storage.

## Scripts

### Install

```bash
bun install
```

### Test

```bash
bun test
```

### Build

```bash
bun run build
```
