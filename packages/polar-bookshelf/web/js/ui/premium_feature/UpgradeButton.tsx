import {useHistory} from "react-router-dom";
import React from "react";
import Button from '@material-ui/core/Button';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import {Billing} from "polar-accounts/src/Billing";
import {deepMemo} from "../../react/ReactUtils";
import {Analytics} from "../../analytics/Analytics";

interface IProps {
    readonly required: Billing.V2PlanLevel;
    readonly feature: string;
}

export const UpgradeButton = deepMemo(function UpgradeButton(props: IProps) {

    const history = useHistory();
    const {required, feature} = props;

    const onUpgrade = React.useCallback(() => {
        Analytics.event({category: 'premium', action: 'upgrade-from-premium-feature-wall'});
        history.push("/plans");
    }, [history])

    return (
        <Button variant="contained"
                size="large"
                color="primary"
                className="border"
                startIcon={<LockOpenIcon/>}
                onClick={() => onUpgrade()}>

            Upgrade to {required} to unlock {feature}

        </Button>
    );

});
