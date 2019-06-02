import * as React from 'react';
import Select from 'react-select';
import {TagOptions} from '../../../../apps/repository/js/TagOptions';
import {Tag} from '../../tags/Tag';
import {ValueType} from 'react-select/lib/types';
import {ActionMeta} from 'react-select/lib/types';
import {TagOption} from '../../../../apps/repository/js/TagOption';

export class TagFilter extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            open: false,
        };

    }

    public render() {

        const options = TagOptions.fromTags(this.props.tags);

        return (

            <Select
                escapeClearsValue
                isMulti
                isClearable
                // onKeyDown={event => this.onKeyDown(event)}
                classNamePrefix="select"
                onChange={(value: ValueType<TagOption>, action: ActionMeta) => this.handleChange(value, action) }
                // defaultValue={this.state.defaultValue}
                options={options}
            />

        );

    }
    private handleChange(selectedOptions: ValueType<TagOption>, action: ActionMeta) {

        // as so as we handle the change we toggle off

        const defaultValue = selectedOptions as TagOption[];

        // this.props.filteredTags.set(TagOptions.toTags(selectedOptions));
        //
        // this.props.refresher();
        //
        // this.setState({defaultValue, open: false});

    }

}

interface IProps {

    readonly tags: ReadonlyArray<Tag>;

}

interface IState {
    readonly open: boolean;
}

