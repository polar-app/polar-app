import * as React from 'react';
import Box from '@material-ui/core/Box';
import {AdaptivePageLayout} from "../../page_layout/AdaptivePageLayout";
import {
    UserReferralCollectionSnapshots,
    useUserReferral
} from "../../../../../web/js/snapshot_collections/UserReferralCollectionSnapshots";
import {LinearProgress} from "@material-ui/core";

const Main = () => {

    const userReferral = useUserReferral();

    return (
        <Box pt={1}>
            Your Referral URL is: https://app.getpolarized.io/invite/{userReferral.right?.user_referral_code}
        </Box>
    );
}


export const ReferralScreen = React.memo(function ReferralScreen() {

    return (
        <AdaptivePageLayout title="Referrals">
            <UserReferralCollectionSnapshots.Latch fallback={<LinearProgress/>}>
                <Main/>
            </UserReferralCollectionSnapshots.Latch>
        </AdaptivePageLayout>
    );
});
