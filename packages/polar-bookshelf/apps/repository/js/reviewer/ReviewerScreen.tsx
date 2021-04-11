import * as React from 'react';
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Reviewers} from "./Reviewers";
import {useFirestore} from "../FirestoreProvider";
import {Reviewer} from './Reviewer';
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import { ReviewerStoreProvider } from './ReviewerStore';


export interface IProps {
    readonly annotations: ReadonlyArray<IDocAnnotation>;
    readonly mode: RepetitionMode;
    readonly onClose?: () => void;
    readonly limit?: number;
}

export const ReviewerScreen = deepMemo(function ReviewerScreen(props: IProps) {

    const firestoreContext = useFirestore();

    const reviewerProvider = React.useCallback(async () => {
        return await Reviewers.create({firestore: firestoreContext!, ...props});
    }, [firestoreContext, props]);

    return (
        <ReviewerStoreProvider>
            <Reviewer reviewerProvider={reviewerProvider}/>
        </ReviewerStoreProvider>
    );

});
