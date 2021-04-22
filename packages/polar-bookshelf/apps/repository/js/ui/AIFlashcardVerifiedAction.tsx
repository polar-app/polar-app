import * as React from 'react';
import {useHistory} from 'react-router-dom';
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {Analytics} from "../../../../web/js/analytics/Analytics";
import {useUserInfoContext} from "../../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import {Plans} from "polar-accounts/src/Plans";
import AIFlashcardsImage from "../../img/ai-flashcards.png";

const useModalStyles = makeStyles((theme) => {
  return createStyles({
    upgradeModalRoot: {
        '& .MuiDialogTitle-root': {
            background: 'transparent',
            color: theme.palette.text.primary,
            padding: theme.spacing(4, 5, 3),
            '& h2': { fontSize: theme.typography.pxToRem(42) }
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(2, 5, 4),
        },
        '& .alert-dialog-content-outer, & .alert-dialog-content-outer .alert-dialog-content-inner': {
            padding: 0,
        }
    },
    upgradeModalContent: {
        paddingBottom: theme.spacing(1),
        padding: theme.spacing(0, 5, 0),
        '& p': { fontSize: theme.typography.pxToRem(20) },
    },
    upgradeModalVideo: {
        maxWidth: "100%"
    }
  });
});

export function useAIFlashcardVerificationWarning() {
    const dialogs = useDialogManager();
    const classes = useModalStyles();

    return React.useCallback((props: {onAccept: () => void}) => {
        dialogs.confirm({
            title: 'Boost Your Productivity With AI flashcards',
            acceptText: "Upgrade for AI Flashcards",
            type: 'primary',
            subtitle: <AIFlashcardVerificationWarning/>,
            onAccept: props.onAccept,
            classes: { root: classes.upgradeModalRoot },
            maxWidth: 'md',
        })

    }, [dialogs, classes.upgradeModalRoot]);

}

export function useAIFlashcardVerifiedAction() {
    const userInfoContext = useUserInfoContext();
    const history = useHistory();

    const triggerWarning = useAIFlashcardVerificationWarning();

    return React.useCallback((delegate: () => void) => {

        const plan = Plans.toV2(userInfoContext?.userInfo?.subscription.plan);

        const required = plan.level === 'free';

        if (required) {

            Analytics.event2('account-upgrade-required', {
                reason: 'ai-flashcards'
            });

            triggerWarning({onAccept: () => history.push('/plans')});

        } else {
            delegate();
        }

    }, [history, triggerWarning, userInfoContext?.userInfo?.subscription.plan]);

}

export const AIFlashcardVerificationWarning = deepMemo(function AIFlashcardVerificationWarning() {
    const styles = useModalStyles();
    return (
        <div className={styles.upgradeModalContent}>
            <video className={styles.upgradeModalVideo} autoPlay loop muted poster={AIFlashcardsImage}>
                <source src="https://getpolarized.io/ai-flashcards.mp4" type="video/mp4" />
            </video>
            <p>
                Create flashcards from your text highlights in one click using AI.
            </p>

            <p>
                Use GPT-3 to automate your workflow and stop typing out every single quesiton and answer pair.
            </p>
        </div>
    )
});

