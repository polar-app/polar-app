import * as React from 'react';
import {Box} from '@material-ui/core';
import {AdaptivePageLayout} from "../../../../apps/repository/js/page_layout/AdaptivePageLayout";
import {MUIActionCard} from '../../mui/MUIActionCard';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";


/**
 * A new screen that opens only for mobile when adding new files, notes,
 * folders..
 */
export const ReviewMobileScreen = React.memo(function ReviewMobileScreen(){

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
                                onAction={NULL_FUNCTION} />

                 <MUIActionCard title="Reading"
                                description="Review other annotations created from your reading."
                                actionButtonTitle="Start Review"
                                onAction={NULL_FUNCTION} />
            </Box>

        </AdaptivePageLayout>
    );
});
