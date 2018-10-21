/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';

/**
 * The sync bar is a bar in the bottom right of the page that displays sync
 * progress and can bring up a popup displaying what it is currently doing.
 */
export class SyncBar extends React.Component<IProps, IState> {

    private value: string = '';

    constructor(props: IProps) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            open: false
        };

    }

    public render() {
        return (
            <div>


            </div>
        );
    }

    private hide() {
        this.setState({
            open: false
        });
    }

    private onCancel() {
        this.hide();
    }

    private toggle() {
        this.setState({
            open: !this.state.open
        });
    }

}

interface IProps {
}

interface IState {
    open: boolean;
}

