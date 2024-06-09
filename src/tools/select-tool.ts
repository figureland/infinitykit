import { system } from '@figureland/statekit'
import type { Tool } from './Tool'
import type { InfinityKit } from '../InfinityKit'
import { box, preciseEnough } from '@figureland/mathkit/box'
import { copy, set, subtract, vector2 } from '@figureland/mathkit/vector2'
import { dp, min } from '@figureland/mathkit/number'
import { max } from '@figureland/mathkit'

export const selectTool = <I extends InfinityKit>(): Tool<I> => {
  const { dispose } = system()
  const brushOrigin = vector2()
  let interacting = false

  return {
    dispose,
    meta: {
      title: 'Select',
      icon: 'select',
      command: 'v'
    },
    onPointerDown: async (kit, p) => {
      const adjusted = kit.canvas.screenToCanvas(p.point)
      copy(brushOrigin, adjusted)
      interacting = true
      kit.state.set({
        brush: box(adjusted.x, adjusted.y, 0, 0)
      })
    },
    onPointerMove: async (kit, p) => {
      if (interacting) {
        const point = kit.canvas.screenToCanvas(p.point)
        const x = min(brushOrigin.x, point.x)
        const y = min(brushOrigin.y, point.y)
        const width = max(brushOrigin.x, point.x) - x
        const height = max(brushOrigin.y, point.y) - y

        const  selection = preciseEnough(box(x, y, width, height))

        kit.state.set({
          brush: preciseEnough(box(x, y, width, height))
        })
      }
    },
    onPointerUp: async (kit, p) => {
      interacting = false
      kit.state.set({
        brush: box()
      })
    },
    onWheel: async (kit, p) => {},
    onSelect: async (kit) => {},
    onDeselect: async (kit) => {}
  }
}
