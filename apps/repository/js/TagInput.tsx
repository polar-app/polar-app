import * as React from 'react';
import {Popover, PopoverBody} from 'reactstrap';
import CreatableSelect from 'react-select/lib/Creatable';
import {Blackout} from './Blackout';
import {RepoDocInfo} from './RepoDocInfo';
import {Tag} from '../../../web/js/tags/Tag';
import {Preconditions} from '../../../web/js/Preconditions';
import {TagsDB} from './TagsDB';
import {Optional} from '../../../web/js/util/ts/Optional';
import {TagSelectOption} from './TagSelectOption';
import {TagSelectOptions} from './TagSelectOptions';
import Select from 'react-select';

let SEQUENCE = 0;

// noinspection TsLint
export class TagInput extends React.Component<TagInputProps, TagInputState> {

    private readonly id = "popover-" + SEQUENCE++;

    constructor(props: TagInputProps, context: any) {
        super(props, context);

        Preconditions.assertPresent(props.repoDocInfo);
        Preconditions.assertPresent(props.repoDocInfo.docInfo, "repoDocInfo.docInfo");

        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            popoverOpen: false
        };

    }
    public render() {

        const options: TagSelectOption[]
            = TagSelectOptions.fromTags(this.props.tagsDB.tags());

        const existingTags: Tag[] = Optional.of(this.props.existingTags).getOrElse([]);

        const defaultValue: TagSelectOption[] = TagSelectOptions.fromTags(existingTags);

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
                            autoFocus
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.handleChange}
                            defaultValue={defaultValue}
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

    private handleChange(selectedOptions: any) {

        console.log(`Options selected:`, selectedOptions);

        if (this.props.onChange) {

            const tags = TagSelectOptions.toTags(selectedOptions);

            this.props.onChange(this.props.repoDocInfo, tags);
        }

    }

}

interface TagInputState {
    popoverOpen: boolean;
}

export interface TagInputProps {

    repoDocInfo: RepoDocInfo;

    tagsDB: TagsDB;

    existingTags?: Tag[];

    onChange?: (repoDocInfo: RepoDocInfo, values: Tag[]) => void;

}
