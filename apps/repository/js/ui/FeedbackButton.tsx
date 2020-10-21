import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import {useLinkLoader} from "../../../../web/js/ui/util/LinkLoaderHook";
import { DeviceRouters } from "../../../../web/js/ui/DeviceRouter";
import {useUserInfoContext} from "../../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import {Plans} from "polar-accounts/src/Plans";
import {MUITooltip} from "../../../../web/js/mui/MUITooltip";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(3),
            // color: theme.palette.text.secondary
        },
    }),
);

/**
 * @Deprecated we're using FeedbackButton2 now
 * @constructor
 */
export function FeedbackButton() {

    const classes = useStyles();
    const linkLoader = useLinkLoader();
    const userInfoContext = useUserInfoContext();

    const handleFeedback = React.useCallback(() => {

        const email = userInfoContext?.userInfo?.email;

        if (! email) {
            return;
        }

        const plan = Plans.toV2(userInfoContext?.userInfo?.subscription.plan).level;
        const interval = userInfoContext?.userInfo?.subscription.interval || 'monthly';

        const params = {
            email: encodeURIComponent(email),
            plan,
            interval
        }

        const url = `https://kevinburton1.typeform.com/to/lXUE4NmP#email=${params.email}&plan=${params.plan}&interval=${params.interval}`;

        linkLoader(url, {newWindow: true, focus: true});

    }, [linkLoader, userInfoContext]);

    return (
        <DeviceRouters.Desktop>
            <MUITooltip title="Send us feedback to help improve Polar.">
                <Fab color="primary"
                     aria-label="Feedback"
                     onClick={handleFeedback}
                     className={classes.root}>
                    <ChatBubbleIcon />
                </Fab>
            </MUITooltip>
        </DeviceRouters.Desktop>
    );
}
