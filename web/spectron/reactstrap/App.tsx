import * as React from 'react';
import Select from 'react-select';
import {Button, Popover, PopoverBody, PopoverHeader} from 'reactstrap';
import CreatableSelect from 'react-select/lib/Creatable';


const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]
class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.state = {
            popoverOpen: false
        };

    }

    private toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    private save() {
        // noop
    }

    public render() {
        return (

            <div>
                <Button id="Popover1" onClick={this.toggle}>
                    Launch Popover
                </Button>
                <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle} className="tag-input-popover">
                    {/*<PopoverHeader>Popover Title</PopoverHeader>*/}
                    <PopoverBody>

                        <label>Enter tags:</label>

                        <CreatableSelect
                            isMulti
                            isClearable
                            className="basic-multi-select"
                            classNamePrefix="select"
                            options={options} />

                        {/*<Button onClick={this.save}>*/}
                            {/*Save*/}
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


