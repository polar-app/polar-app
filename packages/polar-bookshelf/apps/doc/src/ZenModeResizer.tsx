import { Functions } from 'polar-shared/src/util/Functions';
import * as React from 'react';
import { useZenModeStore } from '../../../web/js/mui/ZenModeStore';
import {useDocViewerStore} from "./DocViewerStore";

/**
 * Return true if the value has changed, otherwise false.  The *initial* value
 * doesn't count.
 */
export function useChangedValue<T>(value: T): boolean {

    const lastValue = React.useRef<T | undefined>()


    try {

        if (lastValue.current === undefined) {
            return false;
        }

        return lastValue.current !== value;

    } finally {
        lastValue.current = value;
    }


}

export function useZenModeResizer() {

    const {zenMode} = useZenModeStore(['zenMode']);
    const changedValue = useChangedValue(zenMode);
    const {resizer} = useDocViewerStore(['resizer']);

    React.useEffect(() => {

        if (changedValue) {
            if (resizer) {
                // this has to use timeout
                Functions.withTimeout(() => resizer());
            }
        }

    }, [changedValue, resizer, zenMode])


}
