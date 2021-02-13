import {useEffect} from "react";
import {useDialogManager} from "../mui/dialogs/MUIDialogControllers";
import {AsyncOptions, useAsync} from 'react-async';
import { NULL_FUNCTION } from "polar-shared/src/util/Functions";

export function useComponentDidMount(delegate: () => void) {
    // https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n

    // will only execute the first time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => delegate(), []);
}

export function useComponentWillUnmount(delegate: () => void) {
    // if we return a function it will only execute on unmount

    // this isn't REALLY on unmount though.  There can be no remaining reference
    // to the component.

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => delegate, []);

}

export function useAsyncWithError<T>(opts: AsyncOptions<T>) {

    const dialogs = useDialogManager();
    const {data, error} = useAsync(opts);

    if (error) {
        dialogs.confirm({
            title: "An error occurred.",
            subtitle: "We encountered an error: " + error.message,
            type: 'error',
            onAccept: NULL_FUNCTION,
        })
    }

    return data;

}
