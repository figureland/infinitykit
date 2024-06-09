[![CI](https://github.com/figureland/infinitykit/actions/workflows/ci.yml/badge.svg)](https://github.com/figureland/infinitykit/actions/workflows/ci.yml)
[![NPM](https://img.shields.io/npm/v/@figureland/infinitykit?color=40bd5c)](https://img.shields.io/npm/v/@figureland/infinitykit?color=40bd5c)

**infinitykit** is a toolkit for building infinite canvas apps and experimental map interfaces. This is work in progress software.

The aim of this project is to provide a highly modular box of primitives that you can put together in whatever app or framework you want. The core logic isn't dependent on the DOM, so it makes it simple to render and interact with canvases programmatically on servers, Web Workers, OffscreenCanvas and so on. It tries not to make any many assumptions about how you render your canvas or the shape of your data.

While size wasn't the main priority, **infinitykit** is pretty small. It checks in at **5.37 kB** all in, minified and brotlied. It's written from scratch using only [figure](https://github.com/figureland) dependencies. For now, [SuperJSON](https://github.com/blitz-js/superjson) is also optionally a peer dependency, although the hope is that will be removed and replaced with something custom and more minimal in the future. You'll need that if you want to persist your canvas data to local storage.

If you want to build an amazing whiteboard or node/edge diagramming tool, head over to [tldraw](https://github.com/tldraw/tldraw) and [xyflow](https://github.com/xyflow/xyflow). Those projects are like the Volvo to **infinitykit**'s kit car project.

### Thinking

- This library is 'headless' meaning it doesn't make any assumptions about how or where you want to render your canvas. This comes from the frustration of working with popular React ecosystem components that had fallen out of date and into disrepair, but still had a great quality implementation if you peel back the layers of framework code. I found myself having to update whatever styling system that project used that has since gone out of fashion.
- Perhaps it should just be a Web Component? I wish the story with Web Components was more simple – I agree with [Tom MacWright](https://macwright.com/2024/01/24/on-web-components) on this one. On paper WCs are exactly intended for this sort of project, filling in the gaps with complex interactive components that are impossible to standardise. And yet... it still doesn't feel like the right approach.
- [Radix](https://www.radix-ui.com/) (and others) shows a different path. In particular I was really interested to see Melt UI's [Builder API](https://melt-ui.com/docs/introduction#builder-api). This feels like the right approach for me: wrap all the logic and subscribe to updates, keeping your UI completely separate.

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
