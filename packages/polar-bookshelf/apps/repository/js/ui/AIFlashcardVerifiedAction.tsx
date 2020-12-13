import * as React from 'react';
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {Analytics} from "../../../../web/js/analytics/Analytics";
import { useHistory } from 'react-router-dom';
import {useUserInfoContext} from "../../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import {Plans} from "polar-accounts/src/Plans";

export function useAIFlashcardVerifiedAction() {

    const userInfoContext = useUserInfoContext();
    const dialogs = useDialogManager();
    const history = useHistory();

    return React.useCallback((delegate: () => void) => {

        const plan = Plans.toV2(userInfoContext?.userInfo?.subscription.plan);

        const required = plan.level === 'free';

        if (required) {

            Analytics.event2('account-upgrade-required', {
                reason: 'ai-flashcards'
            });

            dialogs.confirm({
                title: 'Upgrade Required for AI Flashcards',
                acceptText: "Upgrade for AI Flashcards",
                type: 'primary',
                subtitle: <AIFlashcardWarning/>,
                onAccept: () => history.push('/plans')
            })

        } else {
            delegate();
        }

    }, [dialogs, history, userInfoContext?.userInfo?.subscription.plan]);

}

export const AIFlashcardWarning = deepMemo(() => {
    return (
        <div>

            <p>
                AI Flashcards are a premium feature and require either a
                plus or pro account.
            </p>

            <p>
                AI Flashcards use state-of-the-art artificial intelligence
                technology from OpenAI based on GPT3 to automatically build
                question and answer-based flashcards based on the text you
                highlight.
            </p>

            <p>
                No more typing out question and answer pairs. AI Flashcards
                just does all the hard work for you leaving you with more
                time to study!
            </p>

        </div>
    )
});

