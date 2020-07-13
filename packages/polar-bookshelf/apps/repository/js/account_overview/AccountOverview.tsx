import {accounts} from 'polar-accounts/src/accounts';
import * as React from "react";
import { PlanIcon } from './PlanIcon';

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

export class AccountOverview extends React.Component<IProps> {

    public render() {
        return <div style={{display: 'flex'}}>

            <div className="ml-auto mr-auto"
                 style={{
                     display: 'flex'
                 }}>

                <PlanIcon plan="free" active={this.props.plan === 'free'}/>

                <Joiner/>

                <PlanIcon plan="bronze" active={this.props.plan === 'bronze'}/>

                <Joiner/>

                <PlanIcon plan="silver" active={this.props.plan === 'silver'}/>

                <Joiner/>

                <PlanIcon plan="gold" active={this.props.plan === 'gold'}/>

            </div>

        </div>;
    }

}

interface IProps {
    /**
     * The current user's plan.
     */
    readonly plan: accounts.Plan;
}
