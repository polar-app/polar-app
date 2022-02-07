import * as React from 'react';
import Box from '@material-ui/core/Box';
import {AdaptivePageLayout} from "../../page_layout/AdaptivePageLayout";

const Main = () => {

    return (
        <Box pt={1}>

        </Box>
    );
}


export const FeaturesScreen = React.memo(function FeaturesScreen() {

    return (
        <AdaptivePageLayout title="Feature Toggles">
            <Main/>
        </AdaptivePageLayout>
    );
});
