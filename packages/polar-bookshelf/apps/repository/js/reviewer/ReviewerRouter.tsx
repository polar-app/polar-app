import {useAnnotationRepoStore} from "../annotation_repo/AnnotationRepoStore";
import {observer} from "mobx-react-lite";
import {Route, Switch} from "react-router-dom";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import {BlockReviewerScreen, DocAnnotationReviewerScreen} from "./ReviewerScreen";
import * as React from "react";
import {useBlocksAnnotationRepoStore} from "../block_annotation_repo/BlocksAnnotationRepoStore";
import {useNotesIntegrationEnabled} from "../../../../web/js/notes/NoteUtils";

export const BlocksReviewRouter = observer(() => {
    const store = useBlocksAnnotationRepoStore();

    const blockIDs = React.useMemo(() => {
        return store.view.map(({ id }) => id);
    }, [store.view]);

    return (
        <Switch location={ReactRouters.createLocationWithHashOnly()}>
            <Route path='#review-flashcards'>
                <BlockReviewerScreen mode="flashcard"
                                     blockIDs={blockIDs}/>
            </Route>

            <Route path='#review-reading'>
                <BlockReviewerScreen mode="reading"
                                     blockIDs={blockIDs}/>
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
    const notesIntegrationEnabled = useNotesIntegrationEnabled();

    if (notesIntegrationEnabled) {
        return <BlocksReviewRouter />
    }

    return <DocAnnotationReviewRouter />
};
