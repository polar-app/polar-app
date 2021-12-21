import * as React from 'react';
import {Box} from '@material-ui/core';
import {AdaptivePageLayout} from "../../../../apps/repository/js/page_layout/AdaptivePageLayout";
import {MUIActionCard} from '../../mui/MUIActionCard';
import {useHistory} from "react-router-dom";


/**
 * A new screen that opens only for mobile when adding new files, notes,
 * folders..
 */
export const ReviewMobileScreen = React.memo(function ReviewMobileScreen(){

    const history = useHistory()

    const handleFlashcards = React.useCallback(() => {
        history.push({pathname: '/review', hash: '#review-flashcards'})
    }, [history])

    const handleReading = React.useCallback(() => {
        history.push({pathname: '/review', hash: '#review-reading'})
    }, [history])

    return(
        <AdaptivePageLayout noBack title="Flashcards">

            <Box display="flex"
                 flexDirection="column"
                 alignItems="center"
                 justifyContent="center"
                 gridRowGap="2rem"
                 style={{ height: '100%' }}>

                 <MUIActionCard title="Flashcards"
                                description="Review all manual and automatic flashcards."
                                actionButtonTitle="Start Review"
                                onAction={handleFlashcards} />

                 <MUIActionCard title="Reading"
                                description="Review other annotations created from your reading."
                                actionButtonTitle="Start Review"
                                onAction={handleReading} />
            </Box>

        </AdaptivePageLayout>
    );
});
