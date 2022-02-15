import * as React from 'react';
import Box from '@material-ui/core/Box';
import {AdaptivePageLayout} from "../../page_layout/AdaptivePageLayout";
import {
    UserReferralCollectionSnapshots,
    useUserReferral
} from "../../../../../web/js/snapshot_collections/UserReferralCollectionSnapshots";
import {LinearProgress, TextField} from "@material-ui/core";
import {SVGIcon} from "../../../../../web/js/icons/SVGIcon";
import {GiftSVGIcon} from "../../../../../web/js/icons/GiftSVGIcon";
import Button from "@material-ui/core/Button";
import {useDialogManager} from "../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useErrorHandler} from "../../../../../web/js/mui/MUIErrorHandler";

const Main = () => {

    const userReferral = useUserReferral();

    const dialogManager = useDialogManager();
    const errorHandler = useErrorHandler();

    const inviteLink = React.useMemo(() => 'https://app.getpolarized.io/invite/' + userReferral.right?.user_referral_code, [userReferral]);

    const copyLink = React.useCallback(() => {

        navigator.clipboard.writeText(inviteLink)
            .catch(errorHandler);

        dialogManager.snackbar({message: "Invite link copied to clipboard!"})

    }, [dialogManager, errorHandler, inviteLink]);

    return (
        <Box p={1}
             style={{
                 display: 'flex',
                 flexDirection: 'column',
                 maxWidth: '450px',
                 textAlign: 'center',
                 margin: 'auto'
             }}>

            <Box mt={2}>
                <SVGIcon size={150}>
                    <GiftSVGIcon/>
                </SVGIcon>
            </Box>

            <h1>Invite A Friend to Use Polar</h1>

            <h2>When they sign up, you will BOTH get a free month of Polar!</h2>

            <Box mt="4"
                 style={{
                     display: 'flex',
                     // minWidth: '450px',
                     // marginLeft: 'auto',
                     // marginRight: 'auto',
                 }}>

                {/*<Grid container spacing={1}>*/}

                {/*    <Grid item xs={12} sm={10} style={{display: 'flex'}}>*/}
                {/*        <TextField autoFocus={true}*/}
                {/*                   variant="outlined"*/}
                {/*                   style={{flexGrow: 1}}*/}
                {/*                   onClick={copyLink}*/}
                {/*                   value={inviteLink}/>*/}
                {/*    </Grid>*/}

                {/*    <Grid item xs={12} sm={2}>*/}
                {/*        <Button color="primary"*/}
                {/*                size="large"*/}
                {/*                onClick={copyLink}*/}
                {/*                style={{whiteSpace: 'nowrap'}}*/}
                {/*                variant="contained">*/}
                {/*            Copy Link*/}
                {/*        </Button>*/}

                {/*    </Grid>*/}
                {/*</Grid>*/}

                <TextField autoFocus={true}
                           variant="outlined"
                           style={{flexGrow: 1}}
                           onClick={copyLink}
                           value={inviteLink}/>

                <Button color="primary"
                        size="large"
                        onClick={copyLink}
                        style={{whiteSpace: 'nowrap', marginLeft: '5px'}}
                        variant="contained">
                    Copy Link
                </Button>

            </Box>

        </Box>
    );
}


export const ReferralScreen = React.memo(function ReferralScreen() {

    return (
        <AdaptivePageLayout title="Get Free Polar">
            <UserReferralCollectionSnapshots.Latch fallback={<LinearProgress/>}>
                <Main/>
            </UserReferralCollectionSnapshots.Latch>
        </AdaptivePageLayout>
    );
});
