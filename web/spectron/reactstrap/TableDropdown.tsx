import * as React from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Popover, PopoverBody, Tooltip} from 'reactstrap';
import {ConfirmPopover} from '../../../web/js/ui/confirm/ConfirmPopover';
import {TextInputPopover} from '../../../web/js/ui/text_input/TextInputPopover';
import {Logger} from '../../../web/js/logger/Logger';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import {ListOptionType, ListSelector} from "./ListSelector";
import {LightboxPopover} from '../../js/ui/lightbox_popover/LightboxPopover';

const log = Logger.create();

const Styles: IStyleMap = {

    DropdownMenu: {
        zIndex: 999,
        fontSize: '14px'
    },

};

export class TableDropdown extends React.Component<IProps, IState> {

    private open: boolean = false;
    private selected: SelectedOption = 'none';

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.select = this.select.bind(this);
        // this.onDelete = this.onDelete.bind(this);
        // this.onSetTitle = this.onSetTitle.bind(this);
        // this.onCopyURL = this.onCopyURL.bind(this);

        this.state = {
            open: this.open,
            selected: this.selected,
        };

    }

    public render() {

        const options: ListOptionType[] = [
            {
                id: "title",
                label: "Title",
                selected: true
            },
            {
                id: "tags",
                label: "Tags",
                selected: false
            }
        ]
        return (

            <div className="text-right">

                <Dropdown id={this.props.id} isOpen={this.state.open} toggle={this.toggle}>

                    <DropdownToggle color="link" className="table-dropdown-button btn text-muted" id={this.props.id + '-dropdown-toggle'}>
                        <i className="fas fa-ellipsis-h"></i>
                    </DropdownToggle>

                    <DropdownMenu style={Styles.DropdownMenu}>

                        <DropdownItem onClick={() => this.select('change-columns')}>
                            Change Columns
                        </DropdownItem>

                    </DropdownMenu>


                </Dropdown>

                <LightboxPopover placement={'bottom'}
                                 open={this.state.selected === 'change-columns'}
                                 target={this.props.id + '-dropdown-toggle'}
                                 className="p-0"
                                 style={{'fontSize': '14px'}}>

                    <PopoverBody>

                        <ListSelector options={options}
                                      id="list-options"
                                      title="Select columns to display in the table:"
                                      onChange={(value) => console.log(value)}>

                        </ListSelector>

                    </PopoverBody>

                </LightboxPopover>

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

type SelectedOption = 'change-columns' | 'none';

