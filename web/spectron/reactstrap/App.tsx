import * as React from 'react';
import {Button, DropdownItem, DropdownToggle, Input, InputGroup, InputGroupAddon, InputGroupButtonDropdown} from 'reactstrap';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import Navbar from 'reactstrap/lib/Navbar';

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
        return (

            <div>

                    {/*<NavbarBrand href="/">reactstrap</NavbarBrand>*/}
                    {/*<NavbarToggler onClick={this.toggle} />*/}
                    {/*<Collapse isOpen={this.state.isOpen} navbar>*/}
                        {/*<Nav className="ml-auto" navbar>*/}
                            {/*<NavItem>*/}
                                {/*<NavLink href="/components/">Components</NavLink>*/}
                            {/*</NavItem>*/}
                            {/*<NavItem>*/}
                                {/*<NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>*/}
                            {/*</NavItem>*/}
                            {/*<UncontrolledDropdown nav inNavbar>*/}
                                {/*<DropdownToggle nav caret>*/}
                                    {/*Options*/}
                                {/*</DropdownToggle>*/}
                                {/*<DropdownMenu right>*/}
                                    {/*<DropdownItem>*/}
                                        {/*Option 1*/}
                                    {/*</DropdownItem>*/}
                                    {/*<DropdownItem>*/}
                                        {/*Option 2*/}
                                    {/*</DropdownItem>*/}
                                    {/*<DropdownItem divider />*/}
                                    {/*<DropdownItem>*/}
                                        {/*Reset*/}
                                    {/*</DropdownItem>*/}
                                {/*</DropdownMenu>*/}
                            {/*</UncontrolledDropdown>*/}
                        {/*</Nav>*/}
                    {/*</Collapse>*/}

                <Navbar light expand="md" className="p-2 border-bottom link-navbar">

                    <InputGroup size="sm" className="">
                        <InputGroupAddon addonType="prepend">
                            {/*<i className="fa fa-close"></i>*/}

                            <Button type="button"
                                    className="btn btn-outline-secondary"
                                    title="Capture HTML page"
                                    aria-label="">

                                <span className="fa fa-refresh fa-lg" aria-hidden="true"></span>

                            </Button>

                        </InputGroupAddon>
                        <Input className="px-2 mx-1" />
                        <InputGroupAddon addonType="append">
                            {/*<i className="fa fa-close"></i>*/}

                            <Button type="button"
                                    className="btn btn-outline-secondary"
                                    title="Capture the HTML page and save locally"
                                    aria-label=""
                                    disabled>

                                <span className="fa fa-cloud-download fa-lg" aria-hidden="true"></span>

                            </Button>

                        </InputGroupAddon>
                    </InputGroup>
                </Navbar>

                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>

                <div className="components">

                    <InputGroup>
                        <InputGroupAddon addonType="prepend"><Button>I'm a button</Button></InputGroupAddon>
                        <Input />
                    </InputGroup>
                    <br />
                    <InputGroup>
                        <Input />
                        <InputGroupButtonDropdown addonType="append"
                                                  isOpen={this.state.dropdownOpen}
                                                  toggle={this.toggleDropDown}>
                            <DropdownToggle caret>
                                Button Dropdown
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem header>Header</DropdownItem>
                                <DropdownItem disabled>Action</DropdownItem>
                                <DropdownItem>Another Action</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>Another Action</DropdownItem>
                            </DropdownMenu>
                        </InputGroupButtonDropdown>
                    </InputGroup>
                    <br />
                    <InputGroup>
                        <InputGroupButtonDropdown addonType="prepend"
                                                  isOpen={this.state.splitButtonOpen}
                                                  toggle={this.toggleSplit}>
                            <Button outline>Split Button</Button>
                            <DropdownToggle split outline />
                            <DropdownMenu>
                                <DropdownItem header>Header</DropdownItem>
                                <DropdownItem disabled>Action</DropdownItem>
                                <DropdownItem>Another Action</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>Another Action</DropdownItem>
                            </DropdownMenu>
                        </InputGroupButtonDropdown>
                        <Input placeholder="and..." />
                        <InputGroupAddon addonType="append">
                            <Button color="secondary">I'm a button</Button>
                        </InputGroupAddon>
                    </InputGroup>
                </div>

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


