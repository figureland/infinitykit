import { describe, it, expect } from 'bun:test'
import { InfinityKit, initializeCanvasQuery } from '../src'

describe('should', () => {
  it('export InfinityKit', () => {
    expect(InfinityKit).toBeDefined()
  })
  it('creates InfinityKit instance', async () => {
    const query = await initializeCanvasQuery({
      a: { x: 0, y: 0, width: 10, height: 10 },
      b: { x: 10, y: 10, width: 10, height: 10 }
    })

    const ik = new InfinityKit(query)
    expect(ik).toBeInstanceOf(InfinityKit)
  })
})
