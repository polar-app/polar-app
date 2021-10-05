import {AsyncCaches} from "./AsyncCaches";
import IAsyncCache = AsyncCaches.IAsyncCache;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AsyncCacheDelegate<K, V> extends IAsyncCache<K, V>{

}
