import * as React from 'react';
import {DocAnnotation} from '../../DocAnnotation';
import {EditComment} from "./EditComment";
import {CancelButton} from "../CancelButton";
import {NullCollapse} from "../../../ui/null_collapse/NullCollapse";

export class CreateComment extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCancel = this.onCancel.bind(this);

        this.state = {
            active: this.props.active || false
        };

    }

    public render() {

        const cancelButton = <CancelButton onClick={() => this.onCancel()}/>;

        // FIXME: this needs to have a create/update button

        return <NullCollapse open={this.state.active}>

            <EditComment id={'edit-comment-for' + this.props.id}
                         cancelButton={cancelButton}/>;

        </NullCollapse>;

    }

    private onCancel() {
        this.setState({active: false});
    }

}
interface IProps {
    readonly id: string;
    readonly comment: DocAnnotation;
    readonly active?: boolean;
}

interface IState {
    readonly active: boolean;
}


