import React from 'react';
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {useUseLocationChangeCallbacks} from "./UseLocationChangeStore";
import {ILocation} from "../../../../web/js/react/router/ReactRouters";
import {scrollIntoView, ScrollTargets} from './ScrollIntoViewUsingLocation';

interface IProps {
    readonly children: React.ReactElement;
}

function createLocation(location: ILocation): ILocation {
    return {
        hash: location.hash,
        search: location.search,
        pathname: location.pathname
    };
}

export const UseLocationChangeRoot = deepMemo((props: IProps) => {

    const {setInitialScrollLoader} = useUseLocationChangeCallbacks();
    const initialLocation = React.useMemo(() => createLocation(document.location), []);
    const initialScrollTarget = React.useMemo(() => ScrollTargets.parse(initialLocation), []);
    const loaded = React.useRef(false);

    setInitialScrollLoader((ref) => {

        if (! ref) {
            return;
        }

        const target = ref.getAttribute('id');

        if (! target) {
            return;
        }

        if (loaded.current) {
            // we've already loaded the scroll target so we're done.
            return;
        }

        if (target === initialScrollTarget?.target) {

            try {
                scrollIntoView(initialScrollTarget, ref);
            } finally {
                loaded.current = true;
            }
        }

    });

    return props.children;

});
