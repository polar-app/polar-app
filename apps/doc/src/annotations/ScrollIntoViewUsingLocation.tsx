import React from 'react';
import {useLocation} from 'react-router-dom';
import {HashURLs} from "polar-shared/src/util/HashURLs";
import {IDStr} from "polar-shared/src/util/Strings";
import {ILocation} from "../../../../web/js/react/router/ReactRouters";

export function useScrollIntoViewUsingLocation() {

    const scrollTarget = useScrollTargetFromLocation();
    const [ref, setRef] = React.useState<HTMLElement | null>(null);
    const location = useLocation();
    const prevLocation = React.useRef<ILocation | undefined>(undefined);

    function handleLocationChange() {

        if (scrollTarget) {

            if (ref) {

                const id = ref.getAttribute('id');

                if (id === scrollTarget) {

                    console.log("Scrolling target into view: " + scrollTarget, ref);

                    // TODO: this component should take scrollIntoView opts and
                    // pass them here.
                    ref.scrollIntoView();

                }

            }

        }

    }
    if (ref) {

        try {

            if (location.hash !== prevLocation.current?.hash) {
                handleLocationChange();
            }

        } finally {
            prevLocation.current = location;
        }

    }

    return (newRef: HTMLElement | null) => {

        if (ref !== newRef) {
            setRef(newRef);
        }

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
