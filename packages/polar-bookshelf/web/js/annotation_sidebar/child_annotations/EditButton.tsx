import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {EditIcon} from '../../../../web/js/ui/standard_icons/EditIcon';
import {Analytics} from "../../analytics/Analytics";

/**
 */
export class EditButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <Button id={this.props.id}
                    className="text-muted p-1"
                    size="sm"
                    color="clear"
                    disabled={this.props.disabled}
                    title={'Edit ' + this.props.type}
                    onClick={() => this.onClick()}>

                <EditIcon/>

            </Button>
        );

    }

    private onClick() {

        Analytics.event({category: 'annotation-edit', action: this.props.type});
        this.props.onClick();

    }

}

interface IProps {
    /**
     * Called when the button is clicked.
     */
    readonly id: string;
    readonly onClick: () => void;
    readonly type: 'comment' | 'flashcard';
    readonly disabled?: boolean;
}

interface IState {

}
