import * as React from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import {Logger} from 'polar-shared/src/logger/Logger';
import {IStyleMap} from '../../../react/IStyleMap';
import {DocAnnotation} from '../../DocAnnotation';
import {Dialogs} from "../../../ui/dialogs/Dialogs";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

const log = Logger.create();

const Styles: IStyleMap = {

    DropdownMenu: {
        zIndex: 999,
        fontSize: '14px'
    },

};

export class FlashcardDropdown extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onDeleteSelected = this.onDeleteSelected.bind(this);

        this.state = {
            open: false,
        };

    }

    public render() {

        const toggleID = this.props.id + '-dropdown-toggle';

        return (

            <div className="text-right ml-1">

                <Dropdown id={this.props.id} isOpen={this.state.open} toggle={this.toggle}>

                    <DropdownToggle color="clear"
                                    disabled={this.props.disabled}
                                    className="doc-dropdown-button btn text-muted pl-1 pr-1"
                                    id={toggleID}>

                        <i className="fas fa-ellipsis-h"/>

                    </DropdownToggle>

                    <DropdownMenu right>

                        {/*<DropdownItem divider />*/}

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
            title: "Are you sure you want to delete this flashcard?",
            subtitle: "Once deleted this flashcard will no longer be available.",
            type: 'danger',
            onCancel: NULL_FUNCTION,
            onConfirm: () => this.props.onDelete(this.props.flashcard)
        });

    }

    private onDelete() {
        this.props.onDelete(this.props.flashcard);
    }

    private toggle() {

        this.setState({
            open: ! this.state.open
        });

    }

}

interface IProps {
    readonly id: string;
    readonly disabled?: boolean;
    readonly flashcard: DocAnnotation;
    readonly onDelete: (flashcard: DocAnnotation) => void;
}

interface IState {

    open: boolean;

}
