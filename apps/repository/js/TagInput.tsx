import * as React from 'react';
import {Popover, PopoverBody, Button} from 'reactstrap';
import CreatableSelect from 'react-select/lib/Creatable';
import {Blackout} from './Blackout';
import {Tag} from '../../../web/js/tags/Tag';
import {TagsDB} from './TagsDB';
import {Optional} from '../../../web/js/util/ts/Optional';
import {TagSelectOption} from './TagSelectOption';
import {TagSelectOptions} from './TagSelectOptions';
import {Tags} from '../../../web/js/tags/Tags';
import {Logger} from '../../../web/js/logger/Logger';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import {RelatedTags} from '../../../web/js/tags/related/RelatedTags';

let SEQUENCE = 0;

const log = Logger.create();


const Styles: IStyleMap = {

    popover: {
        width: '500px !important',
        maxWidth: '9999px !important'
    },

    label: {
        fontWeight: 'bold'
    },

    relatedTag: {
        display: 'inline-block'
    }

};


export class TagInput extends React.Component<IProps, IState> {

    private readonly id = "popover-" + SEQUENCE++;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            open: false,
            tags: TagSelectOptions.fromTags(this.props.existingTags || [])
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
            = TagSelectOptions.fromTags(this.props.availableTags);

        const existingTags: Tag[] = Optional.of(this.props.existingTags).getOrElse([]);

        const defaultValue: TagSelectOption[] = TagSelectOptions.fromTags(existingTags);

        const relatedTags: string[]
            = this.props.relatedTags.compute(this.state.tags.map(current => current.label))
                                    .map(current => current.tag);

        console.log("FIXME: got related tags: ", relatedTags);

        const RelatedTagsItems = () => {
            return <span>
                {relatedTags.map(item =>
                                     <Button className="p-0"
                                             style={Styles.relatedTag}
                                             color="link"
                                             size="sm"
                                             onClick={() => this.addTag(item)}>{item}</Button>)}
            </span>;

        };


        const RelatedTagsWidget = () => {

            if (relatedTags.length === 0) {
                return <div></div>;
            }

            return <div>
                <strong>Related: </strong>
                <RelatedTagsItems/>
            </div>;

        };

        return (

            <div>

                <i id={this.id} onClick={this.toggle}
                   className="fa fa-tag doc-button doc-button-inactive"/>


                {/*tag-input-popover {*/}
                {/*width: 500px !important;*/}
                {/*max-width: 9999px !important;*/}
            {/*}*/}

                {/*.tag-input-popover label {*/}
                {/*font-weight: bold;*/}
            {/*}*/}

                <Popover placement="auto"
                         isOpen={this.state.open}
                         target={this.id}
                         toggle={this.toggle}
                         className="tag-input-popover">
                    {/*<PopoverHeader>Popover Title</PopoverHeader>*/}

                    {/*style={{borderWidth: '1px', backgroundColor: true ? "#b94a48" : "#aaa"}}*/}
                    <PopoverBody style={Styles.popover}>

                        <strong>Enter tags:</strong>

                        <CreatableSelect
                            isMulti
                            isClearable
                            autoFocus
                            onKeyDown={event => this.onKeyDown(event)}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={selectedOptions => this.handleChange(selectedOptions)}
                            value={this.state.tags}
                            defaultValue={defaultValue}
                            placeholder="Create or select tags ..."
                            options={options} >

                            <div>this is the error</div>

                        </CreatableSelect>

                        <div>

                            <RelatedTagsWidget/>

                        </div>

                    </PopoverBody>
                </Popover>

            </div>

        );

    }


    private addTag(tag: string) {
        // const newTag = new Tag{id: tag, label: tag};

        const newTag: TagSelectOption = {value: tag, label: tag};
        this.setState({...this.state, tags: [...this.state.tags, newTag]});
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

        const tags = TagSelectOptions.toTags(selectedOptions);

        const validTags = Tags.findValidTags(...tags);
        const invalidTags = Tags.findInvalidTags(...tags);

        this.setState({...this.state, tags: TagSelectOptions.fromTags(validTags)});

        if (this.props.onChange) {

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
    readonly availableTags: Tag[];

    /**
     * The existing tags on this item.
     */
    readonly existingTags?: Tag[];

    /**
     * The relatedTags index which is updated as the user selects new tags.
     */
    readonly relatedTags: RelatedTags;

    readonly onChange?: (values: Tag[]) => void;

}

interface IState {

    readonly open: boolean;

    /**
     * The currently selected tags.
     */
    readonly tags: TagSelectOption[];

}




