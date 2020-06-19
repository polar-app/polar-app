import * as React from 'react';
import {Analytics} from "../../analytics/Analytics";
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

/**
 */
export class EditButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <IconButton id={this.props.id}
                        size="small"
                        disabled={this.props.disabled}
                        title={'Edit ' + this.props.type}
                        onClick={() => this.onClick()}>

                <EditIcon/>

            </IconButton>
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
