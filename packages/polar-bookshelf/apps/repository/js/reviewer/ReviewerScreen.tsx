import React, {useState} from 'react';
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Reviewers2} from "./Reviewers2";
import {AsyncOptions, useAsync} from 'react-async';
import {Reviewer2} from "./Reviewer2";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useFirestore} from "../FirestoreProvider";
import {MUIAsyncLoader} from "../../../../web/js/mui/MUIAsyncLoader";
import {ReviewerDialog2} from "./ReviewerDialog2";
import isEqual from "react-fast-compare";
import { useHistory } from 'react-router-dom';


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

    return data;

}

export interface IProps {
    readonly annotations: ReadonlyArray<IDocAnnotation>;
    readonly mode: RepetitionMode;
    readonly onClose?: () => void;
    readonly limit?: number;
}

export const ReviewerScreen = React.memo((props: IProps) => {

    const firestore = useFirestore();
    const history = useHistory();

    const [open, setOpen] = useState<boolean>(true);
    const handleClose = React.useCallback(() => {
        setOpen(false);
        history.replace({pathname: "/annotations", hash: ""});
    }, []);

    async function provider() {
        return await Reviewers2.create({firestore, ...props});
    }

    // FIXME: suspend isn't being run here... we might need to migrate to a
    // store rather than prop drilling which is a pain.

    return (
        <ReviewerDialog2 className="reviewer"
                         open={open}
                         onClose={handleClose}>

            <MUIAsyncLoader provider={provider} render={Reviewer2} onReject={handleClose}/>

        </ReviewerDialog2>
    );

}, isEqual);
