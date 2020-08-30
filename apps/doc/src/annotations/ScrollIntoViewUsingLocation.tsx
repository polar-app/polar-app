import React from 'react';
import {useLocation} from 'react-router-dom';
import {HashURLs} from "polar-shared/src/util/HashURLs";
import {IDStr} from "polar-shared/src/util/Strings";
import {ILocation} from "../../../../web/js/react/router/ReactRouters";
import { arrayStream } from 'polar-shared/src/util/ArrayStreams';

export function useScrollIntoViewUsingLocation() {

    const scrollTarget = useScrollTargetFromLocation();
    const [ref, setRef] = React.useState<HTMLElement | null>(null);
    const location = useLocation();
    const prevLocation = React.useRef<ILocation | undefined>(undefined);

    function handleLocationChange() {

        if (scrollTarget) {

            if (ref) {

                const id = ref.getAttribute('id');

                if (id === scrollTarget.target) {

                    // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
                    const alignToTop = scrollTarget.pos === 'top';

                    // console.log("Scrolling target into view: " + scrollTarget, ref);

                    // TODO: this component should take scrollIntoView opts and
                    // pass them here.
                    ref.scrollIntoView(alignToTop);

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

export interface IScrollTarget {

    readonly target: IDStr;

    // where to align the target
    readonly pos: 'top' | 'bottom';

}

namespace ScrollTargets {

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
 * Use location to parse the annotation.
 */
export function useScrollTargetFromLocation(): IScrollTarget | undefined {
    // TODO: I don't think this is cached across components...
    const location = useLocation();
    return ScrollTargets.parse(location);
}
