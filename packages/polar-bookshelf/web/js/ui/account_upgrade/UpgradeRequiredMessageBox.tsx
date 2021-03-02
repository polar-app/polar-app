import * as React from 'react';
import {MessageBox} from "../util/MessageBox";
import {BlackoutBox} from "../util/BlackoutBox";
import Button from "@material-ui/core/Button";

/**
 * Listen to the machine datastore for this user and if their account isn't in
 * line with the machine data store then we have to force them to upgrade.
 *
 * FIXME MUI this needs to be in a dialog
 */
export class UpgradeRequiredMessageBox extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onUpgrade = this.onUpgrade.bind(this);
        this.onCancel = this.onCancel.bind(this);

    }

    private onCancel() {
        this.props.dispose();
    }

    private onUpgrade() {
        this.props.dispose();
        // TODO: I think this should be a push or should use a <Link>
        document.location.href = '/plans';
    }

    public render() {

        return (<BlackoutBox>

            <MessageBox position='top'>

                <div className="text-center text-grey400 mb-2"
                     style={{fontSize: '95px'}}>

                    <i className="fas fa-smile"/>

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

                    <i className="fas fa-check text-success"/> More storage for larger repositories. <br/>
                    <i className="fas fa-check text-success"/> Supports more devices for cross-device sync.<br/>
                    <i className="fas fa-check text-success"/> Helps fund future development of Polar.<br/>

                </div>

                <div className="text-center mt-4">

                    <Button color="secondary"
                            variant="contained"
                            onClick={() => this.onCancel()}
                            className="">

                        Maybe Later

                    </Button>

                    <Button color="primary"
                            variant="contained"
                            onClick={() => this.onUpgrade()}
                            className="ml-1">

                        Upgrade

                    </Button>

                </div>


            </MessageBox>

        </BlackoutBox>);

    }

}

interface IProps {
    readonly dispose: () => void;
}

interface IState {
}

