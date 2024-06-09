import type { Disposable, Signal } from '@figureland/statekit'
import type { Box } from '@figureland/mathkit/box'
import type { Vector2 } from '@figureland/mathkit/box'

export type QueryIdentifier = string | number | symbol

export type QueryResult<ID> = {
  box: ID[]
  point: ID[]
}

export const createQueryResult = () => ({
  box: [],
  point: []
})

export type Query<ID extends string = string, Item = any> = {
  queryID: QueryIdentifier
  params: QueryParams<ID, Item>
  result: QueryResult<ID>
  resolve: ((result: QueryResult<ID>) => void) | null
}

export type QueryParams<ID extends string, Item> = {
  point?: Vector2
  box?: Box
  filter?: (item: Item) => boolean
  ids?: ID[]
}

export type QueryAPI<ID extends string, Item> = Disposable & {
  readonly processing: Signal<boolean>
  add: (id: ID, item: Item) => void
  update: (id: ID, item: Item) => void
  delete: (id: ID) => void
  get: (id: ID) => Item | undefined
  search: (queryID: QueryIdentifier, params: QueryParams<ID, Item>) => Promise<QueryResult<ID>>
  subscribe: (id: ID) => Signal<Item | undefined>
  signalQuery: <Query extends QueryParams<ID, Item>>(
    id: QueryIdentifier,
    params: Signal<Query>
  ) => Signal<QueryResult<ID>>
}

export type InferQueryID<T> = T extends QueryAPI<infer ID, any> ? ID : never
export type InferQueryItem<T> = T extends QueryAPI<any, infer Item> ? Item : never
