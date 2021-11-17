import React from "react";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import {Billing} from "polar-accounts/src/Billing";
import {deepMemo} from "../../react/ReactUtils";
import { MUIAnchorButton } from "../../../../web/js/mui/MUIAnchorButton";

interface IProps {
    readonly required: Billing.V2PlanLevel;
    readonly feature: string;
}

export const UpgradeButton = deepMemo(function UpgradeButton(props: IProps) {

    const {required, feature} = props;

    return (
        <MUIAnchorButton variant="contained"
                size="large"
                color="primary"
                className="border"
                startIcon={<LockOpenIcon/>}
                href="/plans">

            Upgrade to {required} to unlock {feature}

        </MUIAnchorButton>
    );

});
