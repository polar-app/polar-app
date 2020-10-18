/* eslint-disable react-hooks/exhaustive-deps */

import {useEffect} from "react";

export function useComponentDidMount(delegate: () => void) {
    // https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n

    // will only execute the first time.
    useEffect(() => delegate(), []);
}

export function useComponentWillUnmount(delegate: () => void) {
    // if we return a function it will only execute on unmount

    // this isn't REALLY on unmount though.  There can be no remaining reference
    // to the component.

    useEffect(() => delegate, []);

}

