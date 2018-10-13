import * as React from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import {ConfirmPopover} from '../../js/ui/confirm/ConfirmPopover';
import {TextInputPopover} from '../../js/ui/text_input/TextInputPopover';

export class DocDropdown extends React.Component<IProps, IState> {

    private open: boolean = false;
    private selected: SelectedOption = 'none';

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.select = this.select.bind(this);

        this.state = {
            open: this.open,
            selected: this.selected
        };

    }


    public render() {

        return (

            <div className="text-right">

                <Dropdown id={this.props.id} isOpen={this.state.open} toggle={this.toggle}>

                    <DropdownToggle color="link" className="doc-dropdown-button btn text-muted" id={this.props.id + '-dropdown-toggle'}>
                        <i className="fas fa-ellipsis-h"></i>
                    </DropdownToggle>

                    <DropdownMenu style={{'zIndex': 999}}>

                        <DropdownItem onClick={() => this.select('set-title')}>
                            Set title
                        </DropdownItem>

                        <DropdownItem onClick={() => this.select('delete')}>
                            Delete
                        </DropdownItem>
                    </DropdownMenu>

                </Dropdown>

                <TextInputPopover open={this.state.selected === 'set-title'}
                                  target={this.props.id + '-dropdown-toggle'}
                                  title="Enter title for document:"
                                  onCancel={() => this.select('none')}
                                  onComplete={() => console.log('confirmed')}/>


                <ConfirmPopover open={this.state.selected === 'delete'}
                                target={this.props.id + '-dropdown-toggle'}
                                prompt="Are you sure you want to delete this document?"
                                onCancel={() => this.select('none')}
                                onConfirm={() => console.log('confirmed')}/>

            </div>
        );

    }


    private toggle() {

        if (this.selected !== 'none') {
            this.open = false;
        } else {
            this.open = ! this.state.open;
        }

        this.refresh();

    }

    private select(selected: SelectedOption) {
        this.selected = selected;
        this.refresh();
    }

    private refresh() {

        this.setState({
            open: this.open,
            selected: this.selected
        });

    }

}

interface IProps {
    id: string;
}

interface IState {

    open: boolean;
    selected: SelectedOption;

}

type SelectedOption = 'set-title' | 'delete' | 'none';

