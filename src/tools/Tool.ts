import type { Disposable } from '@figureland/statekit'
import type { PointerState } from '@figureland/toolkit'
import type { InfinityKit } from '../InfinityKit'

export type Tool<C extends InfinityKit<string, any> = InfinityKit<string, any>> = Disposable & {
  meta: {
    title: string
    command?: string
    icon?: string
    hidden?: boolean
  }
  onSelect?(c: C): Promise<void>
  onDeselect?(c: C): Promise<void>
  onPointerDown?(c: C, p: PointerState): Promise<void>
  onPointerMove?(c: C, p: PointerState): Promise<void>
  onPointerUp?(c: C, p: PointerState): Promise<void>
  onWheel?(c: C, p: PointerState): Promise<void>
}

export type Toolset<C extends InfinityKit<string, any> = InfinityKit<string, any>> = {
  [key: string]: Tool<C>
}
