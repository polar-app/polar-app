import React from 'react';
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Reviewers2} from "./Reviewers2";
import {AsyncOptions, useAsync} from 'react-async';
import {Reviewer2} from "./Reviewer2";
import {useDialogManager} from "../../../../web/spectron0/material-ui/dialogs/MUIDialogControllers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useFirestore} from "../FirestoreProvider";
import {MUIAsyncLoader} from "../../../../web/spectron0/material-ui/MUIAsyncLoader";


// FIXME needs to be a dedicated function.
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

    console.log("FIXME2: ", data);

    return data;

}

export interface IProps {
    readonly annotations: ReadonlyArray<IDocAnnotation>;
    readonly mode: RepetitionMode;
    readonly limit?: number;
}

export const ReviewerScreen = (props: IProps) => {

    const firestore = useFirestore();

    async function provider() {
        return await Reviewers2.create({firestore, ...props});
    }

    // FIXME: place the ReviewerDialog here, and pass onClose so that we can
    // close the reviewer dialog.

    // FIXME: Notice is different from dialog as the button is NOT red...

    return (
        <MUIAsyncLoader provider={provider} render={Reviewer2}/>
    );

}
