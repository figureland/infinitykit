import type { Disposable } from '@figureland/statekit'
import type { PointerState } from '@figureland/toolkit'
import { InfinityKit } from '../InfinityKit'

export type Tool<C extends InfinityKit> = Disposable & {
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

export type Toolset<C extends InfinityKit> = {
  [key: string]: Tool<C>
}
