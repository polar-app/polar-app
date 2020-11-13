import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import { DeviceRouters } from "../../../../web/js/ui/DeviceRouter";
import {MUIMenuItem} from "../../../../web/js/mui/menu/MUIMenuItem";
import {MUIMenuPopper} from "../../../../web/js/mui/menu/MUIMenuPopper";
import Tooltip from "@material-ui/core/Tooltip";
import {useZest} from "../../../../web/js/zest/ZestInjector";
import {useLinkLoader} from "../../../../web/js/ui/util/LinkLoaderHook";
import {useUserInfoContext} from "../../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import { Plans } from "polar-accounts/src/Plans";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {useActiveKeyboardShortcutsCallbacks} from "../../../../web/js/hotkeys/ActiveKeyboardShortcutsStore";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import VideoCallIcon from '@material-ui/icons/VideoCall';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import KeyboardIcon from '@material-ui/icons/Keyboard';

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

namespace MenuItems {

    export const SendVideoFeedback = deepMemo(() => {

        const zest = useZest();
        const dialogs = useDialogManager();

        const handleClick = React.useCallback(() => {

            if (zest.supported) {
                zest.trigger();
            } else {

                dialogs.confirm({
                    title: "Video Feedback Not Support",
                    subtitle: "Video feedback is not supported on this platform. Please use our web application to send video feedback.",
                    type: 'error',
                    onAccept: NULL_FUNCTION
                });

            }

        }, [dialogs, zest]);

        return (
            <MUIMenuItem text="Send Video Feedback"
                         icon={<VideoCallIcon/>}
                         onClick={handleClick}/>
        );

    });

    export const RequestFeatures = deepMemo(() => {

        const reportFeedback = useReportFeedback();

        return (
            <MUIMenuItem text="Request Features and Help Improve Polar"
                         icon={<AllInboxIcon/>}
                         onClick={reportFeedback}/>
        );

    });

    export const ShowActiveKeyboardShortcuts = deepMemo(() => {

        const {setShowActiveShortcuts} = useActiveKeyboardShortcutsCallbacks()

        return (
            <MUIMenuItem text="Show Active Keyboard Shortcuts"
                         icon={<KeyboardIcon/>}
                         onClick={() => setShowActiveShortcuts(true)}/>
        );

    });

}

export function FeedbackButton2() {

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [tooltipActive, setTooltipActive] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);

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
                         style={{
                             zIndex: 1000
                         }}
                         color="primary"
                         aria-label="Feedback"
                         onClick={handleClick}
                         onMouseEnter={() => setTooltipActive(true)}
                         onMouseLeave={() => setTooltipActive(false)}
                         className={classes.root}>

                        <div style={{
                                  fontSize: '28px',
                                  lineHeight: '28px'
                              }}>
                            ?
                        </div>

                    </Fab>
                </Tooltip>

                <MUIMenuPopper anchorRef={anchorRef}
                               placement="bottom-end"
                               open={open}
                               onClosed={() => setOpen(false)}>

                    <div>

                        <MenuItems.SendVideoFeedback/>

                        <MenuItems.RequestFeatures/>

                        <MenuItems.ShowActiveKeyboardShortcuts/>

                    </div>

                </MUIMenuPopper>
            </>
        </DeviceRouters.Desktop>
    );
}
