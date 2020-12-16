import * as React from 'react';
import {usePrefsContext} from "./PrefsContext2";

export type SortOrderType = string;

export interface ISortOrder<C extends SortOrderType> {
    readonly col: C;
    readonly order: 'desc' | 'asc';
}

export type SortOrderSetter<C extends SortOrderType> = (order: ISortOrder<C>) => void;

export type SortOrderTuple<C extends SortOrderType> = [ISortOrder<C> | undefined, SortOrderSetter<C>];

export function usePrefForSortOrder<C extends SortOrderType>(key: string): SortOrderTuple<C> {

    const prefsContext = usePrefsContext();

    const prefValue = prefsContext.fetch(key)?.value;

    const toValue = (): ISortOrder<C> | undefined => {

        if (prefValue) {

            try {

                const val = JSON.parse(prefValue);
                return val as ISortOrder<C>;

            } catch (e) {
                console.error("Could not handle value in usePrefForSortOrder: ", e);
                return undefined;
            }

        } else {
            return undefined;
        }
    }

    const value = toValue();

    const setter = React.useCallback((order: ISortOrder<C>) => {

        const json = JSON.stringify(order);
        prefsContext.set(key, json);

    }, [key, prefsContext]);

    return [value, setter];

}