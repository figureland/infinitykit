import { type Signal, signal, Manager } from '@figureland/statekit'
import { values } from '@figureland/typekit/object'
import type { PointerState } from '@figureland/toolkit'
import { box, type Box, type Vector2 } from '@figureland/mathkit/box'
import { type CanvasOptions, Canvas } from './Canvas'
import type { PersistenceName } from '@figureland/statekit/typed-local-storage'
import type { QueryAPI, QueryResult } from './query/query-api'
import { defaultToolset } from './default-tools'
import { getSVGBackgroundPattern, type SVGBackgroundPattern } from './utils/style'

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
  selecting: boolean
  focus: boolean
  hover?: ID
  selection: ID[]
  brush: Box
}

const toolset = defaultToolset()

type DefaultToolset = typeof toolset

export class InfinityKit<
  ID extends string,
  Item extends any,
  API extends QueryAPI<ID, Item> = QueryAPI<ID, Item>
> extends Manager {
  public readonly canvas: Canvas
  public tools: Signal<DefaultToolset>
  public tool: Signal<keyof DefaultToolset>
  public state: Signal<IKState>
  public visible: Signal<QueryResult<ID>>
  public backgroundPattern: Signal<SVGBackgroundPattern>

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
    this.tools = this.use(signal(defaultToolset))
    this.use(() => {
      values(this.tools.get()).forEach((tool) => {
        tool.dispose()
      })
    })

    this.state = this.use(
      signal<IKState>(() => ({
        selecting: false,
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
          box: get(this.canvas.canvasViewport)
        }))
      )
    ) as Signal<QueryResult<ID>>

    this.backgroundPattern = this.use(
      signal((get) =>
        getSVGBackgroundPattern(get(this.canvas.transform), get(this.canvas.options).grid)
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
    this.state.set({
      focus: true
    })
    this.getActiveTool().onPointerDown?.(this, p)
    // if (action) {
    //   this.handleToolAction(action)
    // }
  }

  public onPointerMove = (p: PointerState) => {
    this.getActiveTool().onPointerMove?.(this, p)
    // if (action) {
    //   this.handleToolAction(action)
    // }
  }

  public onPointerUp = (p: PointerState) => {
    this.getActiveTool().onPointerUp?.(this, p)
    // if (action) {
    //   this.handleToolAction(action)
    // }
  }

  public onWheel = (p: PointerState) => {
    this.getActiveTool().onWheel?.(this, p)
    // if (action) {
    //   this.handleToolAction(action)
    // }
  }

  public onSelect = () => {
    this.getActiveTool().onSelect?.(this)
    // if (action) {
    //   this.handleToolAction(action)
    // }
  }

  public onDeselect = () => {
    this.getActiveTool().onDeselect?.(this)
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
