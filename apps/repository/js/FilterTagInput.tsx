import * as React from 'react';
import {Tag} from '../../../web/js/tags/Tag';
import {TagsDB} from './TagsDB';
import Select from 'react-select/lib/Select';


// noinspection TsLint
export class FilterTagInput extends React.Component<FilterTagInputProps, FilterTagInputState> {

    constructor(props: FilterTagInputProps, context: any) {
        super(props, context);

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
        // const options: TagSelectOption[] =
        //     this.props.tagsDBProvider().tags().map( current => {
        //         return {
        //             value: current.id,
        //             label: current.label
        //         };
        //     });
        //
        // // FIXME: need to keep the current value between iterations
        // const defaultValue: TagSelectOption[] = [];
            // existingTags.map(current => {
            //         return {
            //             value: current.id,
            //             label: current.label
            //         };
            //     });

        return (

            <div>

                <Select
                    isMulti
                    isClearable
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={this.handleChange}
                    //defaultValue={defaultValue}
                    // options={options}
                />

                {/*<Button onClick={this.save}>*/}
                {/*Save*/}
                {/*</Button>*/}

            </div>

        );

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

}

export interface FilterTagInputProps {

    tagsDBProvider: () => TagsDB;

    onChange?: (values: Tag[]) => void;

}
