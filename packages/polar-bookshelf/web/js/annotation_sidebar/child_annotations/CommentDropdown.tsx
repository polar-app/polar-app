import * as React from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import {DocAnnotation} from '../DocAnnotation';
import {Dialogs} from "../../ui/dialogs/Dialogs";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export class CommentDropdown extends React.Component<IProps, IState> {

    private open: boolean = false;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onDeleteSelected = this.onDeleteSelected.bind(this);

        this.state = {
            open: this.open,
        };

    }

    public render() {

        const toggleID = this.props.id + '-dropdown-toggle';

        return (

            <div className="text-right">

                <Dropdown id={this.props.id}
                          isOpen={this.state.open}
                          toggle={this.toggle}>

                    <DropdownToggle color="clear"
                                    className="doc-dropdown-button btn text-muted pl-1 pr-1"
                                    disabled={this.props.disabled}
                                    id={toggleID}>

                        <i className="fas fa-ellipsis-h"/>

                    </DropdownToggle>

                    <DropdownMenu right>

                        <DropdownItem className="text-danger" onClick={() => this.onDeleteSelected()}>
                            Delete
                        </DropdownItem>

                    </DropdownMenu>


                </Dropdown>

            </div>

        );

    }

    private onDeleteSelected() {

        Dialogs.confirm({
            title: "Are you sure you want to delete this comment? ",
            subtitle: 'This will permanently delete this comment.',
            type: 'danger',
            onCancel: NULL_FUNCTION,
            onConfirm: () => this.onDelete()
        });

    }

    private onDelete() {
        this.props.onDelete(this.props.comment);
    }

    private toggle() {

        this.open = ! this.state.open;

        this.refresh();

    }

    private refresh() {

        this.setState({
            open: this.open,
        });

    }

}

interface IProps {
    readonly id: string;
    readonly comment: DocAnnotation;
    readonly onDelete: (comment: DocAnnotation) => void;
    readonly disabled?: boolean;
}

interface IState {

    open: boolean;

}
