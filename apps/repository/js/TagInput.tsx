import * as React from 'react';
import {Button, Popover, PopoverBody} from 'reactstrap';
import CreatableSelect from 'react-select/lib/Creatable';
import {Blackout} from './Blackout';
import {Optional} from '../../../web/js/util/ts/Optional';

let SEQUENCE = 0;

// noinspection TsLint
export class TagInput extends React.Component<TagInputProps, TagInputState> {

    private readonly id = "popover-" + SEQUENCE++;

    constructor(props: TagInputProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            popoverOpen: false
        };

    }
    public render() {

        const options: TagOption[] =
            Optional.of(this.props.options).getOrElse([]);

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
                            onChange={this.handleChange}
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

    private toggle() {

        const open = !this.state.popoverOpen;

        if (open) {
            Blackout.enable();
        } else {
            Blackout.disable();

        }

        this.setState({
                          popoverOpen: open
                      });
    }

    private handleChange(selectedOptions: any[]) {
        console.log(`Options selected:`, selectedOptions);
    }

}

interface TagInputState {
    popoverOpen: boolean;
}

export interface TagInputProps {

    onSelected?: (values: string[]) => void;
    options?: TagOption[];

}

export interface TagOption {
    readonly value: string;
    readonly label: string;
}
