import {useAccountUpgrader} from "../../../../web/js/ui/account_upgrade/AccountUpgrader";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useHistory} from "react-router-dom";
import * as React from "react";
import {Plans} from "polar-accounts/src/Plans";
import {Analytics} from "../../../../web/js/analytics/Analytics";
import {Billing} from "polar-accounts/src/Billing";
import {TimeToUpgradeContent} from "./TimeToUpgradeContent";
import V2PlanFree = Billing.V2PlanFree;

export function usePremiumFeatureCallbackDialogWarning() {

    const history = useHistory();
    const dialogManager = useDialogManager();

    return React.useCallback(() => {

        dialogManager.confirm({
            title: 'Account Upgraded Required',
            type: 'none',
            subtitle: <TimeToUpgradeContent/>,
            cancelText: "No Thanks",
            acceptText: "View Plans",
            noDialogTitle: true,
            onAccept: () => history.push('/plans')
        });

    }, [dialogManager, history]);

}

export type PremiumFeatureUpgradeReason = 'anki-export' | 'ai-cloze-flashcard' | 'doc-viewer';

function usePremiumAccountRequiredPredicate(reason: PremiumFeatureUpgradeReason) {

    const accountUpgrade = useAccountUpgrader();

    const premiumFeatureCallbackDialogWarning = usePremiumFeatureCallbackDialogWarning();

    return React.useCallback(() => {

        const currentPlan = Plans.toV2(accountUpgrade?.plan);

        if (currentPlan === V2PlanFree) {

            Analytics.event2('account-upgrade-required', {
                reason
            });

            premiumFeatureCallbackDialogWarning();

            return true;

        }

        return false;

    }, [accountUpgrade, reason, premiumFeatureCallbackDialogWarning])

}


export function usePremiumFeatureCallback(reason: PremiumFeatureUpgradeReason, delegate: () => void) {

    const premiumAccountRequired = usePremiumAccountRequiredPredicate(reason);

    return React.useCallback(() => {

        if (! premiumAccountRequired()) {
            delegate();
        }

    }, [delegate, premiumAccountRequired])

}

/**
 * Wraps a callback with a single argument.
 */
export function usePremiumFeatureCallback1<V>(reason: PremiumFeatureUpgradeReason, delegate: (value: V) => void) {

    const premiumAccountRequired = usePremiumAccountRequiredPredicate(reason);

    return React.useCallback((value) => {

        if (! premiumAccountRequired()) {
            delegate(value);
        }

    }, [delegate, premiumAccountRequired])

}
