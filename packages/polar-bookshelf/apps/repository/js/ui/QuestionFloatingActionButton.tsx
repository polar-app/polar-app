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
import {FADiscordIcon} from "../../../../web/js/mui/MUIFontAwesome";
import {Nav} from "../../../../web/js/ui/util/Nav";
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import Divider from "@material-ui/core/Divider";
import {ZenModeActiveContainer} from "../../../../web/js/mui/ZenModeActiveContainer";
import {Analytics} from "../../../../web/js/analytics/Analytics";

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

    export const Chat = React.memo(function Chat() {

        function onClick() {
            Analytics.event2('featureTriggered', {name: 'QuestionButton.Chat'})

            Nav.openLinkWithNewTab('https://discord.gg/GT8MhA6')
        }

        return (
            <MUIMenuItem icon={<FADiscordIcon/>}
                         text="Chat with Polar Community"
                         onClick={onClick}/>
        );

    })

    export const Documentation = React.memo(function Documentation() {

        function onClick() {
            Analytics.event2('featureTriggered', {name: 'QuestionButton.Documentation'})

            Nav.openLinkWithNewTab('https://getpolarized.io/docs/')
        }

        return (
            <MUIMenuItem icon={<LibraryBooksIcon/>}
                         text="Documentation"
                         onClick={onClick}/>
        );
    });

    export const SendVideoFeedback = deepMemo(() => {

        const zest = useZest();
        const dialogs = useDialogManager();

        const handleClick = React.useCallback(() => {

            Analytics.event2('featureTriggered', {name: 'QuestionButton.SendVideoFeedback'})

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

        const handleClick = React.useCallback(() => {

            Analytics.event2('featureTriggered', {name: 'QuestionButton.RequestFeatures'})
            reportFeedback();
        }, [reportFeedback]);

        return (
            <MUIMenuItem text="Request Features and Help Improve Polar"
                         icon={<AllInboxIcon/>}
                         onClick={handleClick}/>
        );

    });

    export const ShowActiveKeyboardShortcuts = deepMemo(() => {

        const {setShowActiveShortcuts} = useActiveKeyboardShortcutsCallbacks()


        const handleClick = React.useCallback(() => {

            Analytics.event2('featureTriggered', {name: 'QuestionButton.ShowActiveKeyboardShortcuts'})
            setShowActiveShortcuts(true);

        }, [setShowActiveShortcuts]);

        return (
            <MUIMenuItem text="Show Active Keyboard Shortcuts"
                         icon={<KeyboardIcon/>}
                         onClick={handleClick}/>
        );

    });

}

export function QuestionFloatingActionButton() {

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [tooltipActive, setTooltipActive] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);

    const handleClick = React.useCallback(() => {

        Analytics.event2('featureTriggered', {name: 'QuestionButton'})
        setOpen(! open);
    }, [open]);

    return (
        <ZenModeActiveContainer>
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

                            <MenuItems.Chat/>
                            <MenuItems.Documentation/>

                            <Divider/>

                            <MenuItems.SendVideoFeedback/>

                            <MenuItems.RequestFeatures/>

                            <MenuItems.ShowActiveKeyboardShortcuts/>

                        </div>

                    </MUIMenuPopper>
                </>
            </DeviceRouters.Desktop>
        </ZenModeActiveContainer>
    );
}
