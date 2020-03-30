import * as React from 'react';
import {accounts} from 'polar-accounts/src/accounts';
import {RGBs} from "polar-shared/src/util/Colors";

export class PlanIcon extends React.Component<IProps> {

    public render() {

        const computeColor = () => {
            switch (this.props.plan) {
                case "free":
                    return Colors.FREE;
                case "bronze":
                    return Colors.BRONZE;
                case "silver":
                    return Colors.SILVER;
                case "gold":
                    return Colors.GOLD;
            }
        };

        const color = computeColor();

        const border = '2px solid ' + color.toCSS();

        const CheckWhenActive = () => {
            if (this.props.active) {
                return <i className="fas fa-check"
                          style={{fontSize: '25px'}}/>;
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
                         color: color.toCSS()
                     }}>

                    <div className="m-auto">
                        <CheckWhenActive/>
                    </div>

                </div>

                <div className="ml-auto mr-auto text-md">
                    {this.props.plan}
                </div>

            </div>

        );

    }

}

interface IProps {
    readonly plan: accounts.Plan;
    readonly active: boolean;
}

class Colors {
    public static FREE = RGBs.create(0, 0, 0);
    public static BRONZE = RGBs.create(205, 127, 50);
    public static SILVER = RGBs.create(207, 207, 207);
    public static GOLD = RGBs.create(252, 194, 0);
}
