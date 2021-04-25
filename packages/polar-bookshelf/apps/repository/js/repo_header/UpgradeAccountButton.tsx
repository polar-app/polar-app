import * as React from 'react';
import {Link} from "react-router-dom";
import {Analytics} from "../../../../web/js/analytics/Analytics";
import Button from "@material-ui/core/Button";
import {useUserInfoContext} from "../../../../web/js/apps/repository/auth_handler/UserInfoProvider";

export const UpgradeAccountButton = () => {

    const userInfoContext = useUserInfoContext()

    function onUpgrade() {
        Analytics.event({category: 'premium', action: 'upgrade-account-button'});
    }

    if (userInfoContext?.userInfo?.subscription.plan === 'gold') {
        // already at max account level
        return null;
    }

    return (
        <Link to={{pathname: '/plans'}}>
            <Button variant="contained"
                    onClick={() => onUpgrade()}
                    className="border border-success">

                Upgrade Account

            </Button>
        </Link>
    );

}
