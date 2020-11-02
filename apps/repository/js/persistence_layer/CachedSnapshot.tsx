import * as React from 'react';
import {Subject} from "rxjs";
import {SnapshotSubscriber} from "polar-shared/src/util/Snapshots";
import {useComponentWillUnmount} from "../../../../web/js/hooks/ReactLifecycleHooks";
import {useCachedSnapshotSubscriber} from "../../../../web/js/react/CachedSnapshotSubscriber";

export interface ISnapshot<V> {

    /**
     * The actual underlying value.
     */
    readonly value: V | undefined;

    /**
     * True if the snapshot exists in the database.  Used to disambiguate a null
     * or undefined value that was stored vs just a missing value.
     */
    readonly exists: boolean;

    /**
     * The source of the snapshot (cache or server). Mostly for debug purposes.
     */
    readonly source: 'cache' | 'server';

}

interface ICachedSnapshotContext<V> {

    /**
     * The underlying rxjs observable for sending off updates to components.
     */
    readonly subject: Subject<ISnapshot<V>>;

    /**
     * The current value, used for the the initial render of each component
     * and to update it each time so that on useObservableStore we can
     * return the current value.
     */
    current: ISnapshot<V> | undefined;

}

interface ProviderProps {
    readonly key: string;
    readonly snapshotSubscriber: SnapshotSubscriber<any>;
    readonly children: JSX.Element;
}


/**
 * The underlying value 'V' can be undefined in which case 'exists' will be false.
 *
 * Note that if the user defines V as something like string | undefined the value
 * itself could be set to undefined in the database but then exists would be true.
 *
 * However, we do not call render 'children' until we have the first snapshot.
 */
export function createCachedSnapshotSubscriber<V>() {

    const subject = new Subject<ISnapshot<V>>();

    const initialContext: ICachedSnapshotContext<V> = {
        subject,
        current: undefined
    }

    const context = React.createContext<ICachedSnapshotContext<V>>(initialContext);

    /**
     * This component gets the context, then starts listening to it and
     * unsubscribes on component unmount.
     */
    const useSnapshot = React.useCallback(() => {

        const storeContext = React.useContext(context);
        const [value, setValue] = React.useState<ISnapshot<V> | undefined>(storeContext.current);

        const subscriptionRef = React.useRef(storeContext.subject.subscribe(setValue));

        useComponentWillUnmount(() => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
        })

        return value;

    }, [context]);

    const ProviderDelegate = (props: ProviderProps) => {
        const storeContext = React.useContext(context);
        const value = useCachedSnapshotSubscriber({id: props.key, subscriber: props.snapshotSubscriber})
        storeContext.current = value;
        storeContext.subject.next(value);

        if (storeContext.current !== undefined) {
            return props.children;
        } else {
            return null;
        }

    }

    const Provider = (props: ProviderProps) => {

        return (

            <context.Provider value={initialContext}>
                <ProviderDelegate key={props.key} snapshotSubscriber={props.snapshotSubscriber}>
                    {props.children}
                </ProviderDelegate>
            </context.Provider>

        )
    }

    return [Provider, useSnapshot];

}