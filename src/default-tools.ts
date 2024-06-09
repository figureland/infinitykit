import { entityTool } from './tools/entity-tool'
import { regionTool } from './tools/region-tool'
import { moveTool } from './tools/move-tool'
import { selectTool } from './tools/select-tool'
import type { Toolset } from './tools/Tool'
import type { InfinityKit } from './InfinityKit'

export const defaultToolset = <I extends InfinityKit>(): Toolset<I> => ({
  select: selectTool(),
  move: moveTool(),
  entity: entityTool(),
  region: regionTool()
})
