import {Switch} from "react-router-dom";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import * as React from "react";

const AnnotationRepoRoutedViews = () => (

    <Switch location={ReactRouters.createLocationWithHashOnly()}>

        {/*<Route path='#folders'*/}
        {/*       render={() => (*/}
        {/*           <LeftSidebar onClose={onClose}>*/}
        {/*               <main.Folders {...props}/>*/}
        {/*           </LeftSidebar>*/}
        {/*       )}/>*/}

        {/*<Route path='#start-review'*/}
        {/*       render={() => <StartReviewBottomSheet onReading={NULL_FUNCTION} onFlashcards={NULL_FUNCTION}/>}/>*/}

        {/*<Route path='#review-flashcards'*/}
        {/*       component={() => <IndeterminateLoadingModal id="loading-flashcards"*/}
        {/*                                                   provider={() => props.onCreateReviewer('flashcard')}/>}/>*/}

        {/*<Route path='#review-reading'*/}
        {/*       component={() => <IndeterminateLoadingModal id="loading-review"*/}
        {/*                                                   provider={() => props.onCreateReviewer('reading')}/>}/>*/}

    </Switch>

);
