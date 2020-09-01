import React from 'react';
import {HashURLs} from "polar-shared/src/util/HashURLs";
import {IDStr} from "polar-shared/src/util/Strings";
import {IListenable, useLocationUpdateListener} from './UseLocationChangeHook';
import {useLocationChangeStore} from './UseLocationChangeStore';
import {useComponentWillUnmount} from "../../../../web/js/hooks/ReactLifecycleHooks";

export function scrollIntoView(scrollTarget: IScrollTarget, ref: HTMLElement) {

    // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
    const alignToTop = scrollTarget.pos === 'top';

    // TODO: this component should take scrollIntoView opts and
    // pass them here.
    ref.scrollIntoView(alignToTop);

}

export function useScrollIntoViewUsingLocation() {

    const scrollTargetUpdateListener = useScrollTargetUpdateListener();
    const ref = React.useRef<HTMLElement | null>(null);
    const {initialScrollLoader} = useLocationChangeStore(['initialScrollLoader'])

    const unsubscriber = scrollTargetUpdateListener.listen(scrollTarget => {

        if (ref.current) {

            const id = ref.current.getAttribute('id');

            if (id === scrollTarget.target) {
                scrollIntoView(scrollTarget, ref.current);
            } else {
                // noop
            }

        } else {
            // noop
        }

    });

    useComponentWillUnmount(unsubscriber);

    initialScrollLoader(ref.current);

    return (newRef: HTMLElement | null) => {

        if (ref.current !== newRef) {
            ref.current = newRef;
        }

    }

}

export interface IScrollTarget {

    readonly target: IDStr;

    // where to align the target
    readonly pos: 'top' | 'bottom';

}

export namespace ScrollTargets {

    import QueryOrLocation = HashURLs.QueryOrLocation;

    export function parse(queryOrLocation: QueryOrLocation): IScrollTarget | undefined {

        const params = HashURLs.parse(queryOrLocation);
        const target = params.get('target') || undefined;

        const pos = params.get('pos') === 'bottom' ? 'bottom' : 'top';

        if (! target) {
            return undefined;
        }

        return {target, pos};

    }

}


/**
 *
 */
export function useScrollTargetUpdateListener(): IListenable<IScrollTarget> {

    const locationUpdateListener = useLocationUpdateListener();

    function listen(listener: (scrollTarget: IScrollTarget) => void) {

        return locationUpdateListener.listen(newLocation => {

            const scrollTarget = ScrollTargets.parse(newLocation);

            if (scrollTarget) {
                listener(scrollTarget);
            }

        });

    }

    return {listen};

}
