import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {SimpleTooltip} from '../../../../../web/js/ui/tooltip/SimpleTooltip';
import {ConfirmPrompts} from '../../../../../web/js/ui/confirm/ConfirmPrompts';
import {SimpleTooltipEx} from '../../../../../web/js/ui/tooltip/SimpleTooltipEx';

export class MultiDeleteButton extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (<div>

            <SimpleTooltipEx text="Delete multiple documents at once."
                             disabled={this.props.disabled}
                             placement="bottom">

                <Button id="multi-delete-button"
                        size="sm"
                        color="light"
                        className="border"
                        disabled={this.props.disabled}
                        onClick={() => this.onClick()}>

                    <span className="text-danger">
                        <i className="fas fa-trash-alt"></i>
                    </span>

                </Button>

            </SimpleTooltipEx>

        </div>);

    }

    private onClick() {

        if (this.props.disabled) {
            return;
        }

        ConfirmPrompts.create({
            target: '#multi-delete-button',
            title: "Are you sure you want to delete these documents?",
            subtitle: "This is a permanent operation and can't be undone.",
            placement: 'bottom',
            onCancel: () => this.props.onCancel(),
            onConfirm: () => this.props.onConfirm(),
        });

    }

}

interface IProps {
    readonly disabled?: boolean;
    readonly onCancel: () => void;
    readonly onConfirm: () => void;
}

interface IState {
}
