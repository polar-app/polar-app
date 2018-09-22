import * as React from 'react';
import {Button, DropdownItem, DropdownToggle, Input, InputGroup, InputGroupAddon, InputGroupButtonDropdown} from 'reactstrap';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import Navbar from 'reactstrap/lib/Navbar';
import Popover from 'reactstrap/lib/Popover';
import PopoverHeader from 'reactstrap/lib/PopoverHeader';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import ReactSummernote from '../../js/apps/card_creator/elements/schemaform/ReactSummernote';

class App<P> extends React.Component<{}, IAppState> {

    constructor(props: any) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            popoverOpen: false
        };
    }

    public toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    public render() {
        return (
            <div>
                <Button id="Popover1" onClick={this.toggle}>
                    Launch Popover
                </Button>
                <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
                    {/*<PopoverHeader>Popover Title</PopoverHeader>*/}
                    <PopoverBody>


                        <Button size="sm"
                                type="button"
                                className="btn btn-outline-secondary p-2 m-1 rounded-circle"
                                title="Capture HTML page"
                                aria-label=""
                                style={{backgroundColor: 'rgba(255,255,0,0.5)'}} >

                        </Button>

                        <Button size="sm"
                                type="button"
                                className="btn btn-outline-secondary p-2 m-1 rounded-circle"
                                title="Capture HTML page"
                                aria-label=""
                                style={{backgroundColor: 'rgba(255,0,0,0.5)'}} >

                        </Button>

                        <Button size="sm"
                                type="button"
                                className="btn btn-outline-secondary p-2 m-1 rounded-circle"
                                title="Capture HTML page"
                                aria-label=""
                                style={{backgroundColor: 'rgba(0,255,0,0.5)'}} >

                        </Button>


                        <Button size="sm"
                                type="button"
                                className="btn btn-outline-secondary p-2 m-1 rounded-circle"
                                title="Capture HTML page"
                                aria-label=""
                                style={{backgroundColor: 'rgba(0,0,255,0.5)'}} >

                        </Button>

                        <div>
                            <ReactSummernote
                                value=""
                                options={{
                                    id: 'my-summernote',
                                    lang: 'en-US',
                                    height: 280,
                                    placeholder: "Enter a comment",
                                    dialogsInBody: false,
                                    //airMode: true,
                                    // toolbar: [
                                    //     ['style', []],
                                    //     ['font', []],
                                    //     ['fontname', []],
                                    //     ['para', []],
                                    //     ['table', []],
                                    //     ['insert', []],
                                    //     ['view', []],
                                    //     ['image', []]
                                    // ]

                                    // FIXME: add blockquote, code, and pre, and cite

                                    // missing the highlight color pulldown...

                                    toolbar: [
                                        ['style', ['style']],
                                        ['font', ['bold', 'italic', 'underline', 'clear', 'color', 'superscript', 'subscript']],
                                        // ['fontname', ['fontname']],
                                        ['para', ['ul', 'ol', 'paragraph']],
                                        ['table', ['table']],
                                        ['insert', ['link', 'picture', 'video']],
                                        ['view', []]
                                    ]

                                }}
                                // onChange={this.onChange}
                                // onBlur={this.onBlur}
                                // onFocus={this.onFocus}
                                // onSubmit={this.onSubmit}
                                // onImageUpload={this.onImageUpload}
                            />
                        </div>

                        {/*<Button size="sm"*/}
                                {/*type="button"*/}
                                {/*className="btn btn-outline-secondary p-1 m-1 "*/}
                                {/*title="Capture HTML page"*/}
                                {/*aria-label=""*/}
                                {/*style={{backgroundColor: 'yellow'}} >*/}

                            {/*<span className="fa fa-tag" aria-hidden="true"></span>*/}

                        {/*</Button>*/}

                    </PopoverBody>
                </Popover>
            </div>
        );
    }



}

export default App;

interface IAppState {
    popoverOpen: boolean;
}




