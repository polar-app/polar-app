import {useAnnotationRepoStore} from "../annotation_repo/AnnotationRepoStore";
import {Route, Switch} from "react-router-dom";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import {LeftSidebar} from "../../../../web/js/ui/motion/LeftSidebar";
import {StartReviewBottomSheet} from "../../../../web/js/ui/mobile/StartReviewBottomSheet";
import {ReviewerScreen} from "./ReviewerScreen";
import * as React from "react";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export const ReviewRouter = () => {

    // <MUIAsyncLoader provider={provider} render={Foo}/>

    const store = useAnnotationRepoStore();

    return (

        <Switch location={ReactRouters.createLocationWithHashOnly()}>

            {/*<main.Folders {...props}/>*/}

            <Route path='#folders'
                   render={() => (
                       <LeftSidebar onClose={NULL_FUNCTION}>
                           <div>FIXME: folders will go here</div>
                       </LeftSidebar>
                   )}/>

            <Route path='#start-review'
                   render={() => <StartReviewBottomSheet onReading={NULL_FUNCTION} onFlashcards={NULL_FUNCTION}/>}/>

            <Route path='#review-flashcards'>
                <ReviewerScreen mode="flashcard"
                                annotations={store.view}/>
            </Route>

            {/*// <Route path='#review-reading'*/}
            {/*//        component={() => <IndeterminateLoadingModal id="loading-review"*/}
            {/*//                                                    provider={() => props.onCreateReviewer('reading')}/>}/>*/}

        </Switch>

    );
};
