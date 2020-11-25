import * as React from 'react';
import {useAccountUpgrader} from "../../../../web/js/ui/account_upgrade/AccountUpgrader";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {Billing} from "polar-accounts/src/Billing";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {Analytics} from "../../../../web/js/analytics/Analytics";
import { useHistory } from 'react-router-dom';

export namespace AccountVerifiedAction {

    import V2Plan = Billing.V2Plan;

    export function useAccountVerifiedAction() {

        const accountUpgrade = useAccountUpgrader();
        const dialogs = useDialogManager();
        const history = useHistory();

        return React.useCallback((delegate: () => void) => {

            if (accountUpgrade?.required) {

                Analytics.event({
                    category: 'account-upgrade-required',
                    action: accountUpgrade.reason
                });

                dialogs.confirm({
                    title: 'Account Upgraded Required',
                    acceptText: "Upgrade Plan",
                    subtitle: accountUpgrade.reason === 'storage' ?
                        <StorageWarning plan={accountUpgrade.plan}/> :
                        <WebCaptureWarning plan={accountUpgrade.plan}/>,
                    onAccept: () => history.push('/plans')
                })

            } else {
                delegate();
            }

        }, [accountUpgrade?.plan, accountUpgrade?.reason, accountUpgrade?.required, dialogs, history]);

    }

    interface IProps {
        readonly plan: V2Plan;
    }

    export const WebCaptureWarning = deepMemo((props: IProps) => {
        return (
            <div>
                <p>
                    You've reached the limits of your plan and need to upgrade
                    to {props.plan.level}
                </p>

                <p>
                    To continue you could either:
                </p>

                <ul>
                    <li>
                        Upgrade to {props.plan.level} (which we'd really appreciate)
                    </li>
                    <li>
                        Delete some of your web captures so you're lower
                        than the limit.
                    </li>
                </ul>

            </div>
        )
    });

    export const StorageWarning = deepMemo((props: IProps) => {
        return (
            <div>
                <p>
                    You've reached the limits of your plan and need to upgrade
                    to {props.plan.level}
                </p>

                <p>
                    To continue you could either:
                </p>

                <ul>
                    <li>
                        Upgrade to {props.plan.level} (which we'd really appreciate)
                    </li>
                    <li>
                        Delete some of your files so that you're lower than the
                        storage limit.
                    </li>
                </ul>

            </div>
        )
    });


}
