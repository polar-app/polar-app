import React from 'react';
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {useUseLocationChangeCallbacks} from "./UseLocationChangeStore";
import {scrollIntoView} from './ScrollIntoViewUsingLocation';
import {IDStr} from 'polar-shared/src/util/Strings';

interface IProps {
    readonly children: React.ReactElement;
}

export const UseLocationChangeRoot = deepMemo(function UseLocationChangeRoot(props: IProps) {

    const {setInitialScrollLoader} = useUseLocationChangeCallbacks();

    // the last scrolled target so we don't double scroll
    const scrolledNonce = React.useRef<IDStr | undefined>(undefined);

    setInitialScrollLoader((scrollTarget, ref) => {

        if (! ref) {
            return;
        }

        const target = ref.getAttribute('id');

        if (! target) {
            return;
        }

        if (scrolledNonce.current === scrollTarget.n) {
            // we've already loaded the scroll target so we're done.
            return;
        }

        if (target === scrollTarget?.target) {

            try {
                scrollIntoView(scrollTarget, ref);
            } finally {
                scrolledNonce.current = scrollTarget.n;
            }
        }

    });

    return props.children;

});

UseLocationChangeRoot.displayName='UseLocationChangeRoot';
