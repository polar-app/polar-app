import * as React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import {Blackout} from '../../../web/js/ui/blackout/Blackout';
import {Tag} from '../../../web/js/tags/Tag';
import {TagOption} from './TagOption';
import {TagOptions} from './TagOptions';
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


export class TagInput extends React.Component<IProps, IState> {

    private readonly id = IDs.create("popover-");

    /**
     * Tags that we're about to apply but have not yet applied yet.
     */
    private pendingTags: Tag[] = [];

    constructor(props: IProps, context: any) {
        super(props, context);

        this.activate = this.activate.bind(this);
        this.deactivate = this.deactivate.bind(this);

        this.toggle = this.toggle.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onDone = this.onDone.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.changeVisibility = this.changeVisibility.bind(this);
        this.fireChanged = this.fireChanged.bind(this);

        this.state = {
            open: false,
        };

    }

    private activate() {

        this.pendingTags = this.props.existingTags || [];

        this.changeVisibility(true);
    }

    private deactivate() {
        this.changeVisibility(false, true);
    }

    private toggle(caller: string) {
        console.log("FIXME: toggled: ", {caller});
        const open = !this.state.open;
        this.changeVisibility(open);
    }

    private changeVisibility(open: boolean, cancelled: boolean = false) {
        console.log("FIXME: changeVisibility: " , {open, cancelled});

        if (! open) {
            this.fireChanged(cancelled);
        }

        Blackout.toggle(open);

        this.setState({...this.state, open});

    }

    public render() {

        const availableTagOptions = TagOptions.fromTags(this.props.availableTags);

        const pendingTags = TagOptions.fromTags(this.pendingTags);

        const computeRelatedTags = () => {

            const input = [...this.pendingTags]
                            .map(current => current.label)
                            ;

            return this.props.relatedTags.compute(input).map(current => current.tag);

        };

        const relatedTags: string[] = computeRelatedTags();

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
                   onClick={() => this.activate()}
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
                         toggle={() => this.deactivate()}
                         className="tag-input-popover shadow">
                    {/*<PopoverHeader>Popover Title</PopoverHeader>*/}

                    {/*style={{borderWidth: '1px', backgroundColor: true ? "#b94a48" : "#aaa"}}*/}
                    <PopoverBody style={Styles.popover} className="shadow">

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
                            onChange={(selectedOptions) => this.handleChange(selectedOptions as TagOption[])}
                            value={pendingTags}
                            defaultValue={pendingTags}
                            placeholder="Create or select tags ..."
                            options={availableTagOptions} >

                            <div>this is the error</div>

                        </CreatableSelect>

                        <div>

                            <RelatedTagsWidget/>

                        </div>

                        <div className="mt-1">

                            <div style={{display: 'flex'}}>

                                <div className="ml-auto"/>

                                <Button color="secondary"
                                        size="sm"
                                        onClick={() => this.onCancel()}>
                                    Cancel
                                </Button>

                                <div className="ml-1"/>

                                <Button color="primary"
                                        size="sm"
                                        onClick={() => this.onDone()}>
                                    Done
                                </Button>
                            </div>
                        </div>

                    </PopoverBody>
                </Popover>

            </div>

        );

    }

    private addTag(tag: string) {

        const tagOption: TagOption = {value: tag, label: tag};
        this.handleChange([tagOption]);

    }

    private onCancel() {
        this.changeVisibility(false, true);
    }

    private onDone() {
        this.changeVisibility(false, false);
    }

    private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {

        if (event.key === "Escape") {
            console.log("FIXME: got escape");
            this.onCancel();
        }

        if (event.getModifierState("Control") && event.key === "Enter") {
            this.onDone();
    }

    }

    private handleChange(selectedOptions: TagOption[]) {

        const tags = TagOptions.toTags(selectedOptions);

        const validTags = Tags.findValidTags(...tags);
        const invalidTags = Tags.findInvalidTags(...tags);

        if (invalidTags.length !== 0) {

            const invalidTagsStr =
                invalidTags.map(current => current.label)
                    .join(", ");

            Toaster.warning("Some tags were excluded - spaces and other control characters not supported: " + invalidTagsStr,
                            "Invalid tags");

            log.warn("Some tags were invalid", invalidTags);

        }

        // this.setState({...this.state, tagOptions: TagOptions.fromTags(validTags)});

    }

    private fireChanged(cancelled: boolean) {

        console.log("fireChanged: ", {cancelled});

        if (cancelled) {

            this.setState({...this.state});

        } else {

            if (this.props.onChange) {

                console.log("FIXME calling onChange: ");

                // important to always call onChange even if we have no valid tags
                // as this is acceptable and we want to save these to disk.

                // const tags = TagOptions.toTags(this.state.tagOptions);

                // this.props.onChange(tags);

            }

            // this.setState({...this.state, currentTags: this.state.tags});
            this.setState({...this.state});

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


}




