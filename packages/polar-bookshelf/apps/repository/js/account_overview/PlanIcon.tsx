import * as React from 'react';
import {Billing} from "polar-accounts/src/Billing";
import {RGBs} from "polar-shared/src/util/Colors";
import CheckIcon from '@material-ui/icons/Check';
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {Plans} from "polar-accounts/src/Plans";

import V2PlanLevel = Billing.V2PlanLevel;

interface IProps {
    readonly level: V2PlanLevel;
    readonly active: boolean;
}

interface IUserPlanProps {

    /**
     * The current user's plan.
     */
    readonly subscription: Billing.Subscription | undefined;
    readonly className: string;
}

class Colors {
    public static FREE = RGBs.create(0, 0, 0);
    public static BRONZE = RGBs.create(205, 127, 50);
    public static SILVER = RGBs.create(207, 207, 207);
    public static GOLD = RGBs.create(252, 194, 0);
}

export const IconByPlan = deepMemo(function IconByPlan(props: IUserPlanProps) {

    const v2Plan = Plans.toV2(props.subscription?.plan).toString();
    const border = '2px solid #FFFFFF';

    return(
        <div className={props.className} 
                style={{
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    boxSizing: 'border-box',
                    borderRadius: '35px',
                    color: '#FFFFFF',
                    textTransform: 'capitalize',
                    border
            }}>
            <div className="m-auto"
            style={{color: '#FFFFFF', opacity: '54%'}}>
                {'free'}
            </div>
        </div>
    );
});

export const PlanIcon = deepMemo(function PlanIcon(props: IProps) {

    const border = '2px solid black';

    const CheckWhenActive = () => {
        if (props.active) {
            return <CheckIcon/>;
        } else {
            return null;
        }
    };

    return (

        <div style={{
                 display: 'flex',
                 flexDirection: 'column'
             }}>

            <div className=""
                 style={{
                     width: '50px',
                     height: '50px',
                     display: 'flex',
                     boxSizing: 'border-box',
                     borderRadius: '35px',
                     border,
                 }}>

                <div className="m-auto">
                    <CheckWhenActive/>
                </div>

            </div>

            <div className="ml-auto mr-auto text-md">
                <span style={{textTransform: 'capitalize'}}>{props.level}</span>
            </div>

        </div>

    );

});
