import * as React from 'react';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupButtonDropdown,
    ListGroup,
    ListGroupItem
} from 'reactstrap';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import Navbar from 'reactstrap/lib/Navbar';
import Moment from 'react-moment';
import {ListOptionType, ListSelector} from '../../js/ui/list_selector/ListSelector';
import {TableDropdown} from '../../../apps/repository/js/TableDropdown';

class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleSplit = this.toggleSplit.bind(this);
        this.state = {
            dropdownOpen: false,
            splitButtonOpen: false
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
        ];

        return (

            <div>

                {/*<TableDropdown id={'table-dropdown'}></TableDropdown>*/}

                <h1>UI Components</h1>

                <p>
                    List of important UI components in Polar.
                </p>

                <h2>ListSelector</h2>

                <ListSelector options={options}
                              id="list-options"
                              onChange={(value) => console.log(value)}>

                </ListSelector>

                <h2>TableDropdown</h2>

                <TableDropdown id="table-dropdown"/>

            </div>

        );
    }


    private toggleDropDown() {

        this.setState({
            splitButtonOpen: this.state.splitButtonOpen,
            dropdownOpen: !this.state.dropdownOpen
        });

    }

    private toggleSplit() {

        this.setState({
            splitButtonOpen: !this.state.splitButtonOpen
        });

    }



}

export default App;

interface IAppState {
    dropdownOpen: boolean;
    splitButtonOpen: boolean;

}


