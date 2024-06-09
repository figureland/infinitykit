import { system } from '@figureland/statekit'
import type { InfinityKit } from '../InfinityKit'
import type { Tool } from './Tool'

export const moveTool = <I extends InfinityKit>(): Tool<I> => {
  const { dispose } = system()

  return {
    dispose,
    meta: {
      title: 'Move',
      icon: 'move',
      command: 'h'
    },
    onPointerDown: async (kit, p) => {},
    onPointerMove: async (kit, p) => {},
    onPointerUp: async (kit, p) => {},
    onWheel: async (kit, p) => {},
    onSelect: async (kit) => {},
    onDeselect: async (kit) => {}
  }
}
