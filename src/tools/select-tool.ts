import { system } from '@figureland/statekit'
import type { Tool } from './Tool'
import { box, preciseEnough } from '@figureland/mathkit/box'
import { copy, vector2 } from '@figureland/mathkit/vector2'
import { min } from '@figureland/mathkit/number'
import { max } from '@figureland/mathkit'

const lastInArray = <T>(array: T[]): T | undefined => array[array.length - 1]

export const selectTool = (): Tool => {
  const { dispose } = system()
  const brushOrigin = vector2()
  let interacting = false

  const selectionQuery = Symbol()

  return {
    dispose,
    meta: {
      title: 'Select',
      icon: 'select',
      command: 'v'
    },
    onPointerDown: async (kit, p) => {
      const point = kit.canvas.screenToCanvas(p.point)
      copy(brushOrigin, point)
      interacting = true

      const intersection = await kit.api.search(selectionQuery, {
        point: brushOrigin
      })

      // intersection.box = []

      const selected = lastInArray(intersection.point)

      if (selected) {
        console.log('intersection', selected)
      }

      kit.state.set({
        brush: box(point.x, point.y, 0, 0)
      })
    },
    onPointerMove: async (kit, p) => {
      const point = kit.canvas.screenToCanvas(p.point)
      const x = min(brushOrigin.x, point.x)
      const y = min(brushOrigin.y, point.y)
      const width = max(brushOrigin.x, point.x) - x
      const height = max(brushOrigin.y, point.y) - y

      const brush = preciseEnough(box(x, y, width, height))

      const intersection = await kit.api.search(selectionQuery, {
        point,
        box: brush
      })

      if (interacting) {
        kit.state.set({
          selection: intersection.box,
          brush
        })
      } else {
        const selected = lastInArray(intersection.point)

        kit.state.set({
          hover: selected
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
