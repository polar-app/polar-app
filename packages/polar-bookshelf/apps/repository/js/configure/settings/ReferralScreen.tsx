import * as React from 'react';
import Box from '@material-ui/core/Box';
import {AdaptivePageLayout} from "../../page_layout/AdaptivePageLayout";

const Main = () => {

    return (
        <Box pt={1}>

        </Box>
    );
}


export const ReferralScreen = React.memo(function ReferralScreen() {

    return (
        <AdaptivePageLayout title="Referrals">
            <Main/>
        </AdaptivePageLayout>
    );
});
