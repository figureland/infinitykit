export {
  staticCanvasStyle,
  getCanvasStyle,
  boxStyle,
  getSVGBackgroundPattern,
  type SVGBackgroundPattern
} from './utils/style'
export * from './utils/layout'

export * from './utils/geometry'
export {
  backgroundPatterns,
  type BackgroundPatternType,
  isBackgroundPatternType
} from './schema/background.schema'

// Core
export { InfinityKit, type IKActionType, type IKActions, type IKState } from './InfinityKit'

// Query API
export { CanvasQuery, initializeCanvasQuery } from './query/CanvasQuery'
export type {
  QueryIdentifier,
  Query,
  QueryParams,
  QueryAPI,
  InferQueryID,
  InferQueryItem,
  QueryResult
} from './query/query-api'

// Canvas
export type { CanvasState, CanvasOptions } from './Canvas'
export { Canvas } from './Canvas'
export {
  type CanvasInteractionHandler,
  createInteractionHandler,
  attachHandler
} from './interaction-handler'

// Tools
export { defaultToolset } from './default-tools'
export type { Tool } from './tools/Tool'
