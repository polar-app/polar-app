import * as React from 'react';
import Button from '@material-ui/core/Button';

/**
 */
export class CancelButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <Button onClick={() => this.onClick()}>

                Cancel

            </Button>

        );

    }

    private onClick() {
        this.props.onClick();
    }

}

interface IProps {
    readonly onClick: () => void;
}

interface IState {

}
