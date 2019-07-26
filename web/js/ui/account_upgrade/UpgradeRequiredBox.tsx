import * as React from 'react';
import {AccountPlan} from "../../accounts/Account";
import {MessageBox} from "../util/MessageBox";
import Button from "reactstrap/lib/Button";
import {NULL_FUNCTION} from "../../util/Functions";
import {BlackoutBox} from "../util/BlackoutBox";

/**
 * Listen to the machine datastore for this user and if their account isn't in
 * line with the machine data store then we have to force them to upgrade.
 */
export class UpgradeRequiredBox extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (<BlackoutBox>

            <MessageBox position='top'>

                <div className="text-center text-grey400 mb-2"
                     style={{fontSize: '95px'}}>

                    <i className="fas fa-smile"></i>

                </div>

                <div className="text-grey700 text-bold mb-3 text-center"
                     style={{fontSize: '25px', fontWeight: 'bold'}}>

                    It's time to upgrade!

                </div>

                <div style={{maxWidth: '400px'}} className="ml-auto mr-auto text-center">


                    <p className="">
                        You've reach the limits of your plan.
                    </p>

                    <p className="">
                        You'll need to upgrade to premium to add this
                        document.
                    </p>

                    <i className="fas fa-check text-success"></i> More storage for larger repositories. <br/>
                    <i className="fas fa-check text-success"></i> Supports more devices for cross-device sync.<br/>
                    <i className="fas fa-check text-success"></i> Helps fund future development of Polar.<br/>

                </div>

                <div className="text-center mt-4">

                    <Button color="secondary"
                            outline
                            size="md"
                            onClick={NULL_FUNCTION}
                            className="">

                        No Thanks

                    </Button>

                    <Button color="success"
                            size="md"
                            onClick={NULL_FUNCTION}
                            className="ml-1">

                        Upgrade

                    </Button>

                </div>


            </MessageBox>

        </BlackoutBox>);

    }

}

interface IProps {
    readonly planRequired?: AccountPlan;
}

interface IState {
}

