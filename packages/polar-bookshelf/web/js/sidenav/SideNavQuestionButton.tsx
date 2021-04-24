import React from "react";
import { Plans } from "polar-accounts/src/Plans";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import VideoCallIcon from '@material-ui/icons/VideoCall';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import Divider from "@material-ui/core/Divider";
import {Analytics} from "../analytics/Analytics";
import { useActiveKeyboardShortcutsCallbacks } from "../hotkeys/ActiveKeyboardShortcutsStore";
import {deepMemo} from "../react/ReactUtils";
import { useLinkLoader } from "../ui/util/LinkLoaderHook";
import {useUserInfoContext} from "../apps/repository/auth_handler/UserInfoProvider";
import {FADiscordIcon} from "../mui/MUIFontAwesome";
import {Nav} from "../ui/util/Nav";
import {useZest} from "../zest/ZestInjector";
import {useDialogManager} from "../mui/dialogs/MUIDialogControllers";
import {ActiveTabButton} from "./ActiveTabButton";
import {SideNavQuestionMenuItem} from "./SideNavQuestionMenuItem";
import Menu from "@material-ui/core/Menu";

function useReportFeedback() {

    const linkLoader = useLinkLoader();

    return React.useCallback(() => {

        const url ='http://feedback.getpolarized.io/feature-requests';

        linkLoader(url, {newWindow: true, focus: true});

    }, [linkLoader]);

}

namespace MenuItems {

    export const Chat = React.forwardRef<HTMLLIElement, {}>((props, ref) => {

        function onClick() {
            Analytics.event2('featureTriggered', {name: 'QuestionButton.Chat'})

            Nav.openLinkWithNewTab('https://discord.gg/GT8MhA6')
        }

        return (
            <SideNavQuestionMenuItem icon={FADiscordIcon}
                                     ref={ref}
                                     text="Chat with Polar Community"
                                     secondary="Talk to the founders of Polar directly and other community members."
                                     onClick={onClick}/>
        );

    })

    export const Documentation = React.forwardRef<HTMLLIElement, {}>((props, ref) => {

        function onClick() {
            Analytics.event2('featureTriggered', {name: 'QuestionButton.Documentation'})

            Nav.openLinkWithNewTab('https://getpolarized.io/docs/')
        }

        return (
            <SideNavQuestionMenuItem icon={LibraryBooksIcon}
                                     ref={ref}
                                     text="Documentation"
                                     secondary="Get the latest documentation on Polar"
                                     onClick={onClick}/>
        );
    });

    export const SendVideoFeedback = React.forwardRef<HTMLLIElement, {}>((props, ref) => {

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
            <SideNavQuestionMenuItem text="Video Feedback"
                                     ref={ref}
                                     secondary="Have a bug to report or a feature suggestion?  Send in a video report and let us know."
                                     icon={VideoCallIcon}
                                     onClick={handleClick}/>
        );

    });

    export const RequestFeatures = React.forwardRef<HTMLLIElement, {}>((props, ref) => {

        const reportFeedback = useReportFeedback();

        const handleClick = React.useCallback(() => {

            Analytics.event2('featureTriggered', {name: 'QuestionButton.RequestFeatures'})
            reportFeedback();
        }, [reportFeedback]);

        return (
            <SideNavQuestionMenuItem text="Feature Requests"
                                     ref={ref}
                                     secondary="Request features and report bugs to help improve Polar."
                                     icon={AllInboxIcon}
                                     onClick={handleClick}/>
        );

    });

    export const ShowActiveKeyboardShortcuts = React.forwardRef<HTMLLIElement, {}>((props, ref) => {

        const {setShowActiveShortcuts} = useActiveKeyboardShortcutsCallbacks()


        const handleClick = React.useCallback(() => {

            Analytics.event2('featureTriggered', {name: 'QuestionButton.ShowActiveKeyboardShortcuts'})
            setShowActiveShortcuts(true);

        }, [setShowActiveShortcuts]);

        return (
            <SideNavQuestionMenuItem text="Keyboard Shortcuts"
                                     ref={ref}
                                     secondary="Show active keyboard shortcuts to keep you in a state of flow."
                                     icon={KeyboardIcon}
                                     onClick={handleClick}/>
        );

    });

}

function useWindowEscapeListener(callback: () => void) {

    const handler = React.useCallback((event: KeyboardEvent) => {

        if (event.key === 'Escape') {
            callback();
        }

    }, [callback]);

    React.useEffect(() => {

       window.addEventListener('keydown', handler);

       return () => {
           window.removeEventListener('keydown', handler);
       }

    }, [handler]);

}

export function SideNavQuestionButton() {

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handleClick = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    }, [anchorEl]);

    const handleClose = React.useCallback(() => {
        setAnchorEl(null)
    }, []);

    useWindowEscapeListener(handleClose);

    return (
        <>
            <ActiveTabButton title="Help"
                             path="#path"
                             noContextMenu={true}
                             onClick={handleClick}>
                <div style={{
                         userSelect: 'none',
                         fontSize: '25px',
                         lineHeight: '25px'
                     }}>
                    ?
                </div>
            </ActiveTabButton>

            <Menu open={anchorEl !== null}
                  onClose={handleClose}
                  onClick={handleClose}
                  transitionDuration={0}
                  autoFocus={true}
                  anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                  }}
                  transformOrigin={{
                      vertical: 'center',
                      horizontal: 'left',
                  }}
                  anchorEl={anchorEl}>

                <MenuItems.Chat/>
                <MenuItems.Documentation/>

                <Divider/>

                <MenuItems.SendVideoFeedback/>

                <MenuItems.RequestFeatures/>

                <MenuItems.ShowActiveKeyboardShortcuts/>

            </Menu>

        </>
    );
}
