import * as React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import {Button, Popover, PopoverBody} from 'reactstrap';
import {Blackout} from '../../../../web/js/ui/blackout/Blackout';
import {TagSelectOption} from '../TagSelectOption';
import {TagsDB} from '../TagsDB';
import {TagSelectOptions} from '../TagSelectOptions';
import {Tag} from '../../../../web/js/tags/Tag';

// import {SyntheticKeyboardEvent} from 'react-dom';

export class TagButton extends React.Component<IProps, IState> {

    private id: string;

    private selectedTags?: Tag[];

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            popoverOpen: false,
        };

        this.id = this.props.id || 'tag-button-' + Math.floor(Math.random() * 10000);

    }

    public render() {

        const options: TagSelectOption[] =
            this.props.tagsDBProvider().tags().map( current => {
                return {
                    value: current.id,
                    label: current.label
                };
            });

        return (

            <div>

                <Button color="light"
                        id={this.id}
                        size="sm"
                        disabled={this.props.disabled}
                        onClick={this.toggle}
                        className="border">

                    <i className="fa fa-tag doc-button doc-button-selectable"/>

                </Button>

                <Popover placement="bottom"
                         isOpen={this.state.popoverOpen}
                         target={this.id}
                         toggle={this.toggle}
                         trigger="legacy"
                         className="tag-input-popover">

                    <PopoverBody>
                        <CreatableSelect
                            isMulti
                            isClearable
                            autoFocus
                            onKeyDown={event => this.onKeyDown(event)}
                            classNamePrefix="select"
                            onChange={this.handleChange}
                            options={options}
                        />

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

    private toggle() {

        if (this.props.disabled) {
            return;
        }

        const popoverOpen = ! this.state.popoverOpen;

        if (popoverOpen) {

            this.selectedTags = undefined;

            Blackout.enable();

        } else {

            Blackout.disable();

            if (this.props.onSelectedTags && this.selectedTags) {
                this.props.onSelectedTags(this.selectedTags);
            }

        }

        this.setState({...this.state, popoverOpen});

    }

    private handleChange(selectedOptions: any) {

        // as so as we handle the change we toggle off

        const tagSelectOptions: TagSelectOption[] = selectedOptions;

        if (! tagSelectOptions || tagSelectOptions.length === 0) {
            this.selectedTags = undefined;
        } else {
            this.selectedTags = TagSelectOptions.toTags(selectedOptions);
        }

    }

}

interface IProps {

    readonly id?: string;

    readonly disabled?: boolean;

    readonly hidden?: boolean;

    readonly tagsDBProvider: () => TagsDB;

    readonly onSelectedTags?: (tags: Tag[]) => void;

}

interface IState {
    readonly popoverOpen: boolean;
}
