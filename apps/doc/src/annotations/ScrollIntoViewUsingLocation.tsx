import React from 'react';
import {useLocation} from 'react-router-dom';
import {HashURLs} from "polar-shared/src/util/HashURLs";
import {IDStr} from "polar-shared/src/util/Strings";
import {ILocation} from "../../../../web/js/react/router/ReactRouters";

export function useLocationHashChangeCallback(callback: () => void) {

    const location = useLocation();
    const prevLocation = React.useRef<ILocation | undefined>(undefined);

    try {

        if (location.hash !== prevLocation.current?.hash) {
            callback();
        }

    } finally {
        prevLocation.current = location;
    }

}

export function useScrollIntoViewUsingLocation() {

    const scrollTarget = useScrollTargetFromLocation();
    const ref = React.useRef<HTMLElement | null>(null);

    const handleLocation = React.useCallback(() => {

        if (scrollTarget) {

            if (ref.current) {

                const id = ref.current.getAttribute('id');

                if (id === scrollTarget) {

                    console.log("Scrolling target into view: " + scrollTarget, ref);

                    // TODO: this component should take scrollIntoView opts and
                    // pass them here.
                    ref.current.scrollIntoView();

                }

            }

        }

    }, [scrollTarget]);

    // use this callback mechanism because we're using scroll listeners and
    // using that with scrollIntoView caused us to get into infinite loops
    useLocationHashChangeCallback(handleLocation);

    return (newRef: HTMLElement | null) => {
        ref.current = newRef;
    }

}


/**
 * The target of a scroll which should be a DOM ID.
 */
export type ScrollTarget = IDStr;

namespace ScrollTargets {

    import QueryOrLocation = HashURLs.QueryOrLocation;

    export function parse(queryOrLocation: QueryOrLocation): ScrollTarget | undefined{

        const params = HashURLs.parse(queryOrLocation);
        return params.get('target') || undefined;

    }

}


/**
 * Use location to parse the annotation.
 */
export function useScrollTargetFromLocation(): ScrollTarget | undefined {
    // TODO: I don't think this is cached across components...
    const location = useLocation();
    return ScrollTargets.parse(location);
}
