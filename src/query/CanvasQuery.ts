import { calculateBoundingBox, intersects, isBox, type Box } from '@figureland/mathkit/box'
import { type Signal, createEvents, effect, signal, system } from '@figureland/statekit'
import { isAsyncGeneratorFunction, isNotNullish } from '@figureland/typekit/guards'
import { entries } from '@figureland/typekit/object'
import { arraysEquals } from '@figureland/typekit/equals'
import {
  type QueryParams,
  type Query,
  type QueryAPI,
  type QueryIdentifier,
  type QueryResult,
  createQueryResult
} from './query-api'

export class CanvasQuery<ID extends string = string, Item extends any = any>
  implements QueryAPI<ID, Item>
{
  private readonly system = system()
  private readonly entityMap: Map<ID, Item> = new Map()
  private readonly queryQueue: Map<QueryIdentifier, Query<ID, Item>> = new Map()
  public readonly queue = this.system.use(createEvents<Record<QueryIdentifier, QueryResult<ID>>>())
  public readonly data = this.system.use(createEvents<Record<ID, Item>>())
  public readonly processing = this.system.use(signal(() => false))
  public readonly ids = this.system.use(
    signal<ID[]>(() => [], {
      equality: arraysEquals
    })
  )

  constructor() {
    this.data.all(() => {
      this.ids.set(Array.from(this.entityMap.keys()))
    })
  }

  public add = (id: ID, item: Item): void => {
    this.entityMap.set(id, item)
    this.data.emit(id, item)
  }

  public update = (id: ID, item: Item): void => {
    this.entityMap.set(id, item)
    this.data.emit(id, item)
  }

  public delete = (id: ID): void => {
    const previous = this.entityMap.get(id)
    if (previous) {
      this.entityMap.delete(id)
      this.data.emit(id, previous)
    }
  }

  public get = (id: ID): Item | undefined => this.entityMap.get(id)

  public subscribe = (id: ID) =>
    this.system.unique(id, () => {
      const s = signal(() => this.entityMap.get(id))
      this.data.on(id, s.set)
      return s
    })

  public on = this.queue.on

  public search = (
    queryID: QueryIdentifier,
    params: QueryParams<ID, Item> = {}
  ): Promise<QueryResult<ID>> =>
    new Promise((resolve) => {
      const existingQuery = this.queryQueue.get(queryID)

      if (existingQuery) {
        existingQuery.resolve = resolve
        existingQuery.params = params
        existingQuery.result = createQueryResult()
      } else {
        this.queryQueue.set(queryID, {
          queryID,
          params,
          result: createQueryResult(),
          resolve
        })
      }

      if (!this.processing.get()) {
        this.processQueries()
      }
    })

  private processQueries = async (): Promise<void> => {
    this.processing.set(true)

    while (this.queryQueue.size > 0) {
      const queries = Array.from(this.queryQueue.values())
      this.queryQueue.clear()

      for (const [id, entity] of this.entityMap.entries()) {
        for (const query of queries) {
          if (!isBox(entity)) {
            continue
          }
          const matchesID = query.params.ids ? query.params.ids.includes(id) : true
          const matchesFilter = query.params.filter ? query.params.filter(entity) : true

          if (!(matchesID && matchesFilter)) {
            continue
          }
          const withinBox = query.params.box ? intersects(entity, query.params.box) : true
          const withinPoint = query.params.point ? intersects(entity, query.params.point) : true

          if (withinBox) {
            query.result.box.push(id)
          }
          if (withinPoint) {
            query.result.point.push(id)
          }
        }
      }

      for (const query of queries) {
        if (query.resolve) {
          query.resolve(query.result)
          query.resolve = null
        }
        this.queue.emit(query.queryID, query.result)
      }
    }

    this.processing.set(false)
  }

  public signalQuery = <Query extends QueryParams<ID, Item>>(
    id: QueryIdentifier,
    box: Signal<Query>
  ): Signal<QueryResult<ID>> =>
    this.system.unique(id, () => {
      console.log(typeof id)
      const visible = this.system.use(
        signal<QueryResult<ID>>(createQueryResult, {
          equality: (a, b) => arraysEquals(a.box, b.box) && arraysEquals(a.point, b.point)
        })
      )

      const onChange = async (params: Query) => {
        const visibleItems = await this.search(id, params)
        visible.set(visibleItems)
      }

      effect(
        [box],
        ([target]) => {
          onChange(target)
        },
        { trigger: true }
      )

      return visible
    })

  public boundingBox = (locations: ID[]): Box => {
    const boxLikeEntities = locations
      .map((l) => this.entityMap.get(l))
      .filter(isNotNullish)
      .filter(isBox)
    return calculateBoundingBox(boxLikeEntities as Box[])
  }
  public dispose = (): void => {
    this.processing.set(false)
    this.system.dispose()
    this.entityMap.clear()
    this.queryQueue.clear()
  }
}

export const initializeCanvasQuery = async <ID extends string = string, Item = any>(
  items?: Record<ID, Item> | (() => AsyncGenerator<[ID, Item]>)
): Promise<CanvasQuery<ID, Item>> => {
  const query = new CanvasQuery<ID, Item>()

  if (items) {
    if (isAsyncGeneratorFunction(items)) {
      for await (const [id, item] of items()) {
        query.add(id, item)
      }
    } else {
      for (const [id, item] of entries(items)) {
        query.add(id as ID, item)
      }
    }
  }

  return query
}
