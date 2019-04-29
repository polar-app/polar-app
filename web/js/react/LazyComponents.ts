import {ObjectID} from '../util/ObjectIDs';

export function lazyObjEquals(a: LazyMap, b: LazyMap) {

    for (const key of Object.keys(a)) {

        if (! lazyEquals(a[key], b[key])) {
            return false;
        }

    }

    return true;

}

function typ(val: any): string {

    if (val === null) {
        return 'null';
    }

    return typeof val;

}

export function lazyEquals(a: LazyType, b: LazyType) {

    // typeof null is 'object'

    const typA = typ(a);
    const typB = typ(b);

    if (typA !== typB) {
        // they're not the same type while WEIRD is possible in JS
        return false;
    }

    const nrUndefined = [a, b].filter(val => val === undefined).length;
    const nrNull = [a, b].filter(val => val === null).length;

    if ([1].includes(nrUndefined)) {
        return false;
    }

    if ([1].includes(nrNull)) {
        return false;
    }

    if (typA === 'object' && typB === 'object') {
        return (<any> a).oid === (<any> b).oid;
    }

    return a === b;

}

export interface LazyProps extends LazyMap {

}

export interface LazyState extends LazyMap {

}

export interface LazyMap {
    [key: string]: LazyType | undefined | null;
}


export type LazyType = string | number | boolean | ObjectID | undefined | null;

