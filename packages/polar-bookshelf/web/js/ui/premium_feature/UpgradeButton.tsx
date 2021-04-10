import {useHistory} from "react-router-dom";
import React from "react";
import Button from '@material-ui/core/Button';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import {Billing} from "polar-accounts/src/Billing";
import {deepMemo} from "../../react/ReactUtils";

interface IProps {
    readonly required: Billing.V2PlanLevel;
    readonly feature: string;
}

export const UpgradeButton = deepMemo(function UpgradeButton(props: IProps) {

    const history = useHistory();
    const {required, feature} = props;

    return (
        <Button variant="contained"
                size="large"
                color="primary"
                className="border"
                startIcon={<LockOpenIcon/>}
                onClick={() => history.push("/plans")}>

            Upgrade to {required} to unlock {feature}

        </Button>
    );

});
