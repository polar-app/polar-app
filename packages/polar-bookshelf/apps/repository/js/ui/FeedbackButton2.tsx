import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import { DeviceRouters } from "../../../../web/js/ui/DeviceRouter";
import {MUIMenuItem} from "../../../../web/js/mui/menu/MUIMenuItem";
import {MUIMenuPopper} from "../../../../web/js/mui/menu/MUIMenuPopper";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import Tooltip from "@material-ui/core/Tooltip";
import {useZest} from "../../../../web/js/zest/ZestInjector";
import {useLinkLoader} from "../../../../web/js/ui/util/LinkLoaderHook";
import {useUserInfoContext} from "../../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import { Plans } from "polar-accounts/src/Plans";

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

function useReportFeedback() {

    const linkLoader = useLinkLoader();
    const userInfoContext = useUserInfoContext();

    return React.useCallback(() => {

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

}

export function FeedbackButton2() {

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [tooltipActive, setTooltipActive] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);

    const reportFeedback = useReportFeedback();
    const zest = useZest();

    const handleClick = React.useCallback(() => {
        setOpen(! open);
    }, [open]);

    return (
        <DeviceRouters.Desktop>
            <>
                <Tooltip open={tooltipActive && ! open}
                         placement="left"
                         title="Feedback and Resources.">
                    <Fab ref={anchorRef}
                         color="primary"
                         aria-label="Feedback"
                         onClick={handleClick}
                         onMouseEnter={() => setTooltipActive(true)}
                         onMouseLeave={() => setTooltipActive(false)}
                         className={classes.root}>
                        <ChatBubbleIcon />
                    </Fab>
                </Tooltip>

                <MUIMenuPopper anchorRef={anchorRef}
                               placement="bottom-end"
                               open={open}
                               onClosed={() => setOpen(false)}>

                    <div>

                        {zest.supported && (
                            <MUIMenuItem text="Send Video Feedback"
                                         onClick={zest.trigger}/>)}

                        <MUIMenuItem text="Request Features and Help Improve Polar"
                                     onClick={reportFeedback}/>

                    </div>

                </MUIMenuPopper>
            </>
        </DeviceRouters.Desktop>
    );
}
