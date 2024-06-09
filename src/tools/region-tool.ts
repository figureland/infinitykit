import { system } from '@figureland/statekit'
import type { InfinityKit } from '../InfinityKit'
import type { Tool } from './Tool'

export const regionTool = (): Tool => {
  const { dispose } = system()

  return {
    dispose,
    meta: {
      title: 'Add region',
      icon: 'region',
      command: 'r'
    },
    onPointerDown: async (kit, p) => {},
    onPointerMove: async (kit, p) => {},
    onPointerUp: async (kit, p) => {},
    onWheel: async (kit, p) => {},
    onSelect: async (kit) => {},
    onDeselect: async (kit) => {}
  }
}
