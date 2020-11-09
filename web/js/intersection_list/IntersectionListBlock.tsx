import * as React from 'react';
import { deepMemo } from '../react/ReactUtils';

interface IProps<V> {

    readonly values: ReadonlyArray<V>;

}
//
// /**
//  * Intersection listener that uses 'blocks' of components
//  */
// export const IntersectionList = deepMemo(() => {
//
// });