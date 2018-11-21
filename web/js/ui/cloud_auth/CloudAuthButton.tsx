/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Button, Popover, PopoverBody} from 'reactstrap';
import Popper from 'popper.js';

export class CloudAuthButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
        };

    }

    public render() {
        return (
            <Button color="primary" size="sm">
                Enable Cloud Sync
            </Button>
        );
    }

}

interface IProps {
}

interface IState {
}
