import '@antv/g6';
import {GraphOptions, IAbstractGraph, IG6GraphEvent, IGraph} from '@antv/g6';

declare module '@antv/g6' {
    type IGraphOptions =  Omit<GraphOptions,"container"> & {
        container: string | HTMLElement | null;
    }
    type prefix = "node" | "edge"
    type eventType = "mouseenter" | "mouseleave"
    type GraphOnEvent = `${prefix}:${eventType}`
     class Graph extends AbstractGraph implements IGraph {
            constructor(cfg: IGraphOptions)
    }
    abstract class AbstractGraph extends EventEmitter implements IAbstractGraph {
        on<T = IG6GraphEvent>(eventName: GraphOnEvent, callback: (e: T) => void, once?: boolean): this;
    }

}
