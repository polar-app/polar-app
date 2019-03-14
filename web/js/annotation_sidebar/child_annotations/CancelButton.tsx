import * as React from 'react';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import Button from 'reactstrap/lib/Button';
import {EditIcon} from '../../../../web/js/ui/standard_icons/EditIcon';

/**
 */
export class CancelButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <Button color="secondary"
                    size="sm"
                    className="mt-2 mr-1"
                    onClick={() => this.onClick()}>

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
