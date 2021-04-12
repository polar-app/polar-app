import {Billing} from "polar-accounts/src/Billing";
import * as React from "react";
import {PlanIcon} from './PlanIcon';
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {Plans} from "polar-accounts/src/Plans";

const Joiner = () => (
    <div className="ml-2 mr-2"
         style={{
             display: 'flex',
             flexDirection: 'column',
             width: '20px',
             borderWidth: '2px'
         }}>

        <div style={{
                 borderBottom: '2px solid var(--secondary)',
                 height: '25px'
             }}
        />
        <div className="border-secondary border-top mb-auto"/>

    </div>
);


interface IProps {

    /**
     * The current user's plan.
     */
    readonly subscription: Billing.Subscription;

}

export const AccountOverview = deepMemo(function AccountOverview(props: IProps) {

    const v2Plan = Plans.toV2(props.subscription.plan);

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>

            {/*<MUITooltip title={`Subscribed to plan '${v2Plan.level}' billed at interval '${props.subscription.interval}'`}>*/}

                <div className="ml-auto mr-auto"
                     style={{
                         display: 'flex'
                     }}>

                    <PlanIcon level='free' active={v2Plan.level === 'free'}/>

                    <Joiner/>

                    <PlanIcon level='plus' active={v2Plan.level === 'plus'}/>

                    <Joiner/>

                    <PlanIcon level='pro' active={v2Plan.level === 'pro'}/>

                </div>
            {/*</MUITooltip>*/}

        </div>
    );

});
