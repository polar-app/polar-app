import * as React from 'react';
import {Button, Popover, PopoverBody} from 'reactstrap';
import CreatableSelect from 'react-select/lib/Creatable';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
];

let SEQUENCE = 0;

export class TagInput<P> extends React.Component<{}, IAppState> {

    private readonly id = "popover-" + SEQUENCE++;

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

    public render() {

        return (

            <div>

                <i id={this.id} onClick={this.toggle} className="fa fa-tag doc-button doc-button-inactive"/>

                <Popover placement="auto"
                         isOpen={this.state.popoverOpen}
                         target={this.id}
                         toggle={this.toggle}
                         className="tag-input-popover">
                    {/*<PopoverHeader>Popover Title</PopoverHeader>*/}
                    <PopoverBody>

                        <strong>Enter tags:</strong>

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

    private save() {
        // noop
    }

}

interface IAppState {
    popoverOpen: boolean;
}


