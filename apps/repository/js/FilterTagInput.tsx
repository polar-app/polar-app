import * as React from 'react';
import {Tag} from '../../../web/js/tags/Tag';
import {TagsDB} from './TagsDB';
import {TagSelectOption} from './TagInput';
import Select from 'react-select';
import {Popover, PopoverBody} from 'reactstrap';
import {Blackout} from './Blackout';

// noinspection TsLint
export class FilterTagInput extends React.Component<FilterTagInputProps, FilterTagInputState> {

    private readonly id = "filter-tag-input";

    constructor(props: FilterTagInputProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            popoverOpen: false
        };

        // FIXME: next steps:

        // make DocRepository non-nullable and always available
        // add an update handler on TagsDB so that we can refresh teh state
        // of the FilterTagInput when that's change.
        //
        // Then I just need to build out filtering so that if tags are picked
        // we can show just a subset.
        //

    }
    public render() {
        //
        const options: TagSelectOption[] =
            this.props.tagsDBProvider().tags().map( current => {
                return {
                    value: current.id,
                    label: current.label
                };
        });

        //
        // // FIXME: need to keep the current value between iterations
        const defaultValue: TagSelectOption[] = [];
            // existingTags.map(current => {
            //         return {
            //             value: current.id,
            //             label: current.label
            //         };
            //     });

        return (

            <div>

                <label id={this.id} onClick={this.toggle}>
                    Tags:
                    <i className="fa fa-tag doc-button doc-button-selectable"/>
                </label>

                <Popover placement="bottom"
                         isOpen={this.state.popoverOpen}
                         target={this.id}
                         toggle={this.toggle}
                         className="tag-input-popover">

                    <PopoverBody>

                        <Select
                            isMulti
                            isClearable
                            className="filter-tag-input"
                            classNamePrefix="select"
                            // onChange={this.handleChange}
                            defaultValue={defaultValue}
                            options={options}
                        />

                    </PopoverBody>

                </Popover>

            </div>

        );

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

    private handleChange(selectedOptions: any) {

        // TODO: couldn't figure out the input type situation here.

        console.log(`Options selected:`, selectedOptions);
        //
        // if (this.props.onChange) {
        //
        //     const tags = this.toTags(selectedOptions);
        //
        //     this.props.onChange(this.props.repoDocInfo, tags);
        // }

    }

}

interface FilterTagInputState {
    popoverOpen: boolean;
}

export interface FilterTagInputProps {

    tagsDBProvider: () => TagsDB;

    onChange?: (values: Tag[]) => void;

}
