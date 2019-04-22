import * as React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import {Blackout} from '../../../web/js/ui/blackout/Blackout';
import {Tag} from '../../../web/js/tags/Tag';
import {Optional} from '../../../web/js/util/ts/Optional';
import {TagSelectOption} from './TagSelectOption';
import {TagSelectOptions} from './TagSelectOptions';
import {Tags} from '../../../web/js/tags/Tags';
import {Logger} from '../../../web/js/logger/Logger';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import {RelatedTags} from '../../../web/js/tags/related/RelatedTags';
import Button from 'reactstrap/lib/Button';
import Popover from 'reactstrap/lib/Popover';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import {Toaster} from '../../../web/js/ui/toaster/Toaster';
import {IDs} from '../../../web/js/util/IDs';

const log = Logger.create();


const Styles: IStyleMap = {

    popover: {
        width: '500px !important',
        maxWidth: '9999px !important'
    },

    label: {
        fontWeight: 'bold'
    },

    relatedTags: {
        marginTop: '5px',
        display: 'flex',
    },

    relatedTagsLabel: {
        marginTop: 'auto',
        marginBottom: 'auto'
    },

    relatedTag: {
        display: 'inline-block',
        backgroundColor: '#e5e5e5',
        color: 'hsl(0,0%,20%)',
        fontSize: '12px',
        padding: '3px',
        marginTop: 'auto',
        marginBottom: 'auto'
    }

};


export class TagInput extends React.PureComponent<IProps, IState> {

    private readonly id = IDs.create("popover-");

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            open: false,
            tags: []
        };

    }

    public toggle() {

        const open = !this.state.open;

        Blackout.toggle(open);

        const tags = TagSelectOptions.fromTags(this.props.existingTags || []);

        this.setState({...this.state, open, tags});

    }

    public render() {

        const availableTagOptions: TagSelectOption[]
            = TagSelectOptions.fromTags(this.props.availableTags);

        const existingTags: Tag[] = Optional.of(this.props.existingTags).getOrElse([]);

        const defaultValue: TagSelectOption[] =
            TagSelectOptions.fromTags(existingTags)
                .sort((a, b) => a.label.localeCompare(b.label));

        const relatedTags: string[]
            = this.props.relatedTags.compute(this.state.tags.map(current => current.label))
                                    .map(current => current.tag);

        const RelatedTagsItems = () => {
            return <span>
                {relatedTags.map(item =>
                     <Button className="mr-1"
                             key={item}
                             style={Styles.relatedTag}
                             color="light"
                             size="sm"
                             onClick={() => this.addTag(item)}>{item}</Button>)}
            </span>;

        };


        const RelatedTagsWidget = () => {

            if (relatedTags.length === 0) {
                return <div></div>;
            }

            return <div style={Styles.relatedTags}>
                <div className="mr-1" style={Styles.relatedTagsLabel}>
                    <strong>Related tags: </strong>
                </div>
                <RelatedTagsItems/>
            </div>;

        };

        return (

            <div className="mt-auto mb-auto">

                <i id={this.id}
                   onClick={this.toggle}
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
                         trigger="legacy"
                         toggle={this.toggle}
                         className="tag-input-popover shadow">
                    {/*<PopoverHeader>Popover Title</PopoverHeader>*/}

                    {/*style={{borderWidth: '1px', backgroundColor: true ? "#b94a48" : "#aaa"}}*/}
                    <PopoverBody style={Styles.popover}>

                        <div className="pt-1 pb-1">
                            <strong>Assign tags to document:</strong>
                        </div>

                        <CreatableSelect
                            isMulti
                            isClearable
                            autoFocus
                            onKeyDown={event => this.onKeyDown(event)}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(selectedOptions) => this.handleChange(selectedOptions as TagSelectOption[])}
                            value={this.state.tags}
                            defaultValue={defaultValue}
                            placeholder="Create or select tags ..."
                            options={availableTagOptions} >

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

        const newTag: TagSelectOption = {value: tag, label: tag};
        const tags = [...this.state.tags, newTag];
        this.setState({...this.state, tags});
        this.handleChange(tags);

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

    private handleChange(selectedOptions: TagSelectOption[]) {

        const tags = TagSelectOptions.toTags(selectedOptions);

        const validTags = Tags.findValidTags(...tags);
        const invalidTags = Tags.findInvalidTags(...tags);

        if (invalidTags.length !== 0) {

            const invalidTagsStr =
                invalidTags.map(current => current.label)
                    .join(", ");

            Toaster.warning("Some tags were excluded - spaces and other control characters not supported: " + invalidTagsStr,
                            "Invalid tags");

        }

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




