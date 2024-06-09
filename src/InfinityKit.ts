import { type Signal, signal, Manager, type ReadonlySignal } from '@figureland/statekit'
import { values } from '@figureland/typekit/object'
import type { PointerState } from '@figureland/toolkit'
import { box, type Box, type Vector2 } from '@figureland/mathkit/box'
import { type CanvasOptions, Canvas } from './Canvas'
import type { PersistenceName } from '@figureland/statekit/typed-local-storage'
import type { InferQueryID, QueryAPI } from './query/query-api'
import { defaultTools, type DefaultToolset } from './default-tools'

export type IKActionType = {
  type: string
  state: any
}

export type IKActions =
  | {
      type: 'idle'
      state: null
    }
  | {
      type: 'select'
      state: Box
    }
  | {
      type: 'pan'
      state: Vector2
    }
  | {
      type: 'draw'
      state: [Box, Vector2[]]
    }
  | {
      type: 'move'
      state: Vector2
    }
  | {
      type: 'resize'
      state: Box
    }

export type IKState<ID extends string = string> = {
  focus: boolean
  selection: ID[]
  brush: Box
}

export class InfinityKit<API extends QueryAPI = QueryAPI> extends Manager {
  public readonly canvas: Canvas
  public tools: Signal<DefaultToolset>
  public tool: Signal<keyof DefaultToolset>
  public state: Signal<IKState>
  public visible: Signal<InferQueryID<API>[]>
  public selection: Signal<InferQueryID<API>[]>

  constructor(
    public api: API,
    {
      initialCanvasState,
      persistence
    }: {
      initialCanvasState?: Partial<CanvasOptions>
      persistence?: PersistenceName
    } = {}
  ) {
    super()
    this.tool = this.use(signal<keyof DefaultToolset>(() => 'select'))
    this.tools = this.use(signal(() => defaultTools))
    this.use(() => {
      values(this.tools.get()).forEach((tool) => {
        tool.dispose()
      })
    })

    this.state = this.use(
      signal<IKState>(() => ({
        brush: box(),
        focus: false,
        selection: []
      }))
    )

    this.canvas = this.use(
      new Canvas({
        options: initialCanvasState,
        persistence
      })
    )
    this.visible = this.use(
      api.signalQuery(
        Symbol(),
        signal((get) => ({
          target: get(this.canvas.canvasViewport)
        }))
      )
    )

    this.selection = this.use(
      api.signalQuery(
        Symbol(),
        signal((get) => ({
          target: get(this.state).brush
        }))
      )
    )
  }

  public setTool = (tool: keyof DefaultToolset) => {
    if (tool !== this.tool.get()) {
      this.onDeselect()
      this.tool.set(tool)
      this.onSelect()
    }
  }

  public getActiveTool = () => this.tools.get()[this.tool.get()]

  public onFocus = () => {
    this.state.set({
      focus: true
    })
    console.log('focus')
  }

  public onBlur = () => {
    this.state.set({
      focus: false
    })
  }

  public wheel: Canvas['wheel'] = (point, delta) => {
    this.canvas.wheel(point, delta)
  }

  public onPointerDown = (p: PointerState) => {
    const action = this.getActiveTool().onPointerDown?.(this, p)
    // if (action) {
    //   this.handleToolAction(action)
    // }
  }

  public onPointerMove = (p: PointerState) => {
    if (!this.state.get().focus) {
      return
    }
    const action = this.getActiveTool().onPointerMove?.(this, p)
    // if (action) {
    //   this.handleToolAction(action)
    // }
  }

  public onPointerUp = (p: PointerState) => {
    const action = this.getActiveTool().onPointerUp?.(this, p)
    // if (action) {
    //   this.handleToolAction(action)
    // }
  }

  public onWheel = (p: PointerState) => {
    const action = this.getActiveTool().onWheel?.(this, p)
    // if (action) {
    //   this.handleToolAction(action)
    // }
  }

  public onSelect = () => {
    const action = this.getActiveTool().onSelect?.(this)
    // if (action) {
    //   this.handleToolAction(action)
    // }
  }

  public onDeselect = () => {
    const action = this.getActiveTool().onDeselect?.(this)
    // if (action) {
    //   this.handleToolAction(action)
    // }
  }

  public handleToolAction = (action: IKActions) => {
    switch (action.type) {
      case 'idle':
        console.log('cm:idle')
        break
      case 'select':
        console.log('cm:select')
        break
      case 'pan':
        console.log('cm:move-canvas')
        break
      case 'draw':
        console.log('cm:draw-entity')
        break
      case 'move':
        console.log('cm:move-entity')
        break
      case 'resize':
        console.log('cm:resize-entity')
        break
      default:
        console.log('Unknown action type')
    }
  }
}
