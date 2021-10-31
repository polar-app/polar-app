import {useAnnotationRepoStore} from "../annotation_repo/AnnotationRepoStore";
import {observer} from "mobx-react-lite";
import {Route, Switch} from "react-router-dom";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import {BlockReviewerScreen, DocAnnotationReviewerScreen} from "./ReviewerScreen";
import * as React from "react";
import {useBlocksAnnotationRepoStore} from "../block_annotation_repo/BlocksAnnotationRepoStore";
import {NEW_NOTES_ANNOTATION_BAR_ENABLED} from "../../../../apps/doc/src/DocViewer";

export const BlocksReviewRouter = observer(() => {
    const store = useBlocksAnnotationRepoStore();

    return (
        <Switch location={ReactRouters.createLocationWithHashOnly()}>
            <Route path='#review-flashcards'>
                <BlockReviewerScreen mode="flashcard"
                                     blocks={store.view}/>
            </Route>

            <Route path='#review-reading'>
                <BlockReviewerScreen mode="reading"
                                     blocks={store.view}/>
            </Route>
        </Switch>
    );
});

export const DocAnnotationReviewRouter = () => {
    const store = useAnnotationRepoStore(['view']);

    return (

        <Switch location={ReactRouters.createLocationWithHashOnly()}>


            <Route path='#review-flashcards'>
                <DocAnnotationReviewerScreen mode="flashcard"
                                             annotations={store.view}/>
            </Route>

            <Route path='#review-reading'>
                <DocAnnotationReviewerScreen mode="reading"
                                             annotations={store.view}/>
            </Route>

        </Switch>

    );
};

export const ReviewRouter = () => {
    if (NEW_NOTES_ANNOTATION_BAR_ENABLED) {
        return <BlocksReviewRouter />
    }

    return <DocAnnotationReviewRouter />
};
