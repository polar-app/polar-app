import * as React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import {TagOptions} from '../../../../apps/repository/js/TagOptions';
import {Tag, Tags} from 'polar-shared/src/tags/Tags';
import {TagOption} from '../../../../apps/repository/js/TagOption';
import {ActionMeta, ValueType} from "react-select/lib/types";

export class TagCreateSelect extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            open: false,
        };

    }

    public render() {

        if (this.props.disabled) {
            return <div/>;
        }

        const tags = Tags.regularTagsThenFolderTagsSorted(this.props.tags);

        const options = TagOptions.fromTags(tags, true);

        return (

            <CreatableSelect
                escapeClearsValue
                isMulti
                isClearable
                // onKeyDown={event => this.onKeyDown(event)}
                classNamePrefix="select"
                onChange={(value: ValueType<TagOption>, action: ActionMeta) => this.handleChange(value, action) }
                // defaultValue={this.state.defaultValue}
                placeholder="Filter by tag or folder ..."
                options={options}
            />

        );

    }
    private handleChange(selectedOptions: ValueType<TagOption>, action: ActionMeta) {

        // as so as we handle the change we toggle off

        const tagValues = selectedOptions as TagOption[];

        const tags = TagOptions.toTags(tagValues);
        this.props.onChange(tags);

    }

}

interface IProps {

    readonly tags: ReadonlyArray<Tag>;
    readonly onChange: (tags: ReadonlyArray<Tag>) => void;
    readonly disabled?: boolean;

}

interface IState {
    readonly open: boolean;
}

