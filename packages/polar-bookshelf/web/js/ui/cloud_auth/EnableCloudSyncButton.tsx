/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {SimpleTooltip} from '../tooltip/SimpleTooltip';
import Button from '@material-ui/core/Button';

const log = Logger.create();

export class EnableCloudSyncButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {

            return (
                <div>

                    <Button id="enable-cloud-sync"
                            color="primary"
                            variant="contained"
                            onClick={() => this.props.onClick()}>

                        {/*FIXME: this needs an icon*/}
                        {/*<i className="fas fa-sign-in-alt" style={{marginRight: '5px'}}/>*/}

                        <span className="d-none-mobile">Login</span>

                    </Button>

                    <SimpleTooltip target="enable-cloud-sync">
                        Cloud sync enables synchronizing your repository across
                        multiple computers.  Files are distributed in real time
                        and always up to date.
                    </SimpleTooltip>

                </div>
            );

    }

}

interface IProps {
    readonly onClick: () => void;
}

interface IState {
}
