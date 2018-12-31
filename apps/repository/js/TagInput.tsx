import * as React from 'react';
import {Popover, PopoverBody} from 'reactstrap';
import CreatableSelect from 'react-select/lib/Creatable';
import {Blackout} from './Blackout';
import {Tag} from '../../../web/js/tags/Tag';
import {TagsDB} from './TagsDB';
import {Optional} from '../../../web/js/util/ts/Optional';
import {TagSelectOption} from './TagSelectOption';
import {TagSelectOptions} from './TagSelectOptions';
import {Tags} from '../../../web/js/tags/Tags';
import {Logger} from '../../../web/js/logger/Logger';

let SEQUENCE = 0;

const log = Logger.create();

export class TagInput extends React.Component<IProps, IState> {

    private readonly id = "popover-" + SEQUENCE++;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            open: false
        };

    }

    public toggle() {

        const open = !this.state.open;

        Blackout.toggle(open);

        this.setState({
            open
        });

    }

    public render() {

        const options: TagSelectOption[]
            = TagSelectOptions.fromTags(this.props.tags);

        const existingTags: Tag[] = Optional.of(this.props.existingTags).getOrElse([]);

        const defaultValue: TagSelectOption[] = TagSelectOptions.fromTags(existingTags);

        return (

            <div>

                <i id={this.id} onClick={this.toggle} className="fa fa-tag doc-button doc-button-inactive"/>

                <Popover placement="auto"
                         isOpen={this.state.open}
                         target={this.id}
                         toggle={this.toggle}

                         className="tag-input-popover">
                    {/*<PopoverHeader>Popover Title</PopoverHeader>*/}

                    {/*style={{borderWidth: '1px', backgroundColor: true ? "#b94a48" : "#aaa"}}*/}
                    <PopoverBody>

                        <strong>Enter tags:</strong>

                        <CreatableSelect
                            isMulti
                            isClearable
                            autoFocus
                            onKeyDown={event => this.onKeyDown(event)}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={selectedOptions => this.handleChange(selectedOptions)}
                            defaultValue={defaultValue}
                            placeholder="Create or select tags ..."
                            options={options} >

                            <div>this is the error</div>

                        </CreatableSelect>

                    </PopoverBody>
                </Popover>

            </div>

        );

    }

    private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {

        if (event.key === "Escape") {
            this.toggle();
        }

        if (event.getModifierState("Control") && event.key === "Enter") {
            this.toggle();
        }

    }

    private save() {
        // noop
    }

    private handleChange(selectedOptions: any) {

        if (this.props.onChange) {

            const tags = TagSelectOptions.toTags(selectedOptions);

            const validTags = Tags.findValidTags(...tags);
            const invalidTags = Tags.findInvalidTags(...tags);

            // important to always call onChange even if we have no valid tags
            // as this is acceptable and we want to save these to disk.
            this.props.onChange(validTags);

            if (invalidTags.length > 0) {
                log.warn("Some tags were invalid", invalidTags);
            }

        }

    }

}

export interface IProps {

    /**
     * The tags that can be selected.
     */
    readonly tags: Tag[];

    /**
     * The existing tags on this item.
     */
    readonly existingTags?: Tag[];

    readonly onChange?: (values: Tag[]) => void;

}

interface IState {
    readonly open: boolean;
}




