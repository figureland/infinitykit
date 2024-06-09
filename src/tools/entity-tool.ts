import { system } from '@figureland/statekit'
import type { InfinityKit } from '../InfinityKit'
import type { Tool } from './Tool'

export const entityTool = <I extends InfinityKit>(): Tool<I> => {
  const { dispose } = system()

  return {
    dispose,
    meta: {
      title: 'Add node',
      icon: 'entity'
    },
    onPointerDown: async (kit, p) => {},
    onPointerMove: async (kit, p) => {},
    onPointerUp: async (kit, p) => {},
    onWheel: async (kit, p) => {},
    onSelect: async () => {
      console.log('enter entity')
    },
    onDeselect: async () => {
      console.log('exit entity')
    }
  }
}
