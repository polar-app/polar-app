import * as React from 'react';
import CreatableSelect from 'react-select/Creatable';
import {TagOption} from './TagOption';
import {TagOptions} from './TagOptions';
import {Tag, Tags} from 'polar-shared/src/tags/Tags';
import {Logger} from 'polar-shared/src/logger/Logger';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import {RelatedTagsManager} from '../../../web/js/tags/related/RelatedTagsManager';
import Button from 'reactstrap/lib/Button';
import Popover from 'reactstrap/lib/Popover';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import {Toaster} from '../../../web/js/ui/toaster/Toaster';
import {IDs} from '../../../web/js/util/IDs';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {PremiumFeature} from "../../../web/js/ui/premium_feature/PremiumFeature";
import {BlackoutBox} from "../../../web/js/ui/util/BlackoutBox";

const log = Logger.create();

const Styles: IStyleMap = {

    popover: {
        backgroundColor: 'var(--primary-background-color)',
        width: '500px !important',
        maxWidth: '9999px !important'
    },

    label: {
        fontWeight: 'bold'
    },

    relatedTags: {
        display: 'flex',
    },

    relatedTagsLabel: {
        marginTop: 'auto',
        marginBottom: 'auto'
    },

    relatedTag: {
        display: 'inline-block',
        backgroundColor: 'var(--grey100)',
        color: 'hsl(0,0%,20%)',
        fontSize: '12px',
        padding: '3px',
        marginTop: 'auto',
        marginBottom: 'auto'
    }

};

export class TagInput extends React.Component<IProps, IState> {

    private readonly id = IDs.create("popover-");

    private select: CreatableSelect<TagOption> | null = null;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.activate = this.activate.bind(this);
        this.deactivate = this.deactivate.bind(this);

        this.onCancel = this.onCancel.bind(this);
        this.onDone = this.onDone.bind(this);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            open: false,
            pendingTags: []
        };

    }

    private activate() {

        const pendingTags = this.props.existingTags ? this.props.existingTags() : [];
        this.setState({open: true, pendingTags});

    }

    private deactivate() {
        this.setState({open: false});
    }

    public render() {

        const relatedTagsManager = this.props.relatedTags || new RelatedTagsManager();

        const availableTagOptions = TagOptions.fromTags(this.props.availableTags);

        const pendingTags = TagOptions.fromTags(this.state.pendingTags);

        const computeRelatedTags = () => {

            const input = [...this.state.pendingTags]
                            .map(current => current.label)
                            ;

            return relatedTagsManager.compute(input).map(current => current.tag);

        };

        const relatedTags: string[] = computeRelatedTags();

        const RelatedTagsItems = () => {
            return <span>
                {relatedTags.map(item =>
                     <Button className="mr-1"
                             key={item}
                             style={Styles.relatedTag}
                             color="light"
                             size={this.props.size || 'sm'}
                             onClick={() => this.addRelatedTag(item)}>{item}</Button>)}
            </span>;

        };


        const RelatedTagsWidget = () => {

            if (relatedTags.length === 0) {
                return null;
            }

            return <div style={Styles.relatedTags}>
                <div className="mr-1"
                     style={Styles.relatedTagsLabel}>
                    <strong>Related tags: </strong>
                </div>
                <RelatedTagsItems/>
            </div>;

        };

        return (

            <div className="mt-auto mb-auto">

                <Button id={this.id}
                        onClick={() => this.activate()}
                        color="clear"
                        className={this.props.className || ''}>
                    <span className="fas fa-tag"/>
                </Button>

                <Popover placement={this.props.placement || 'auto'}
                         isOpen={this.state.open}
                         target={this.id}
                         fade={false}
                         delay={0}
                         toggle={() => this.deactivate()}
                         style={{
                             width: '500px',
                             maxWidth: 'calc(100vw - 5px)'
                         }}
                         container={this.props.container}
                         className="tag-input-popover shadow">

                    <PopoverBody style={Styles.popover}
                                 className="shadow rounded">

                        {/*TODO unify this with TagInputWidget*/}

                        <BlackoutBox>

                            <div className="bg-white">

                                <div className="pt-1 pb-1">
                                    <strong>Assign tags:</strong>
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
                                    options={availableTagOptions}
                                    ref={ref => this.select = ref}>

                                </CreatableSelect>

                                <div className="pt-1">

                                    <PremiumFeature required='bronze' size='sm' feature="related tags">
                                        <RelatedTagsWidget/>
                                    </PremiumFeature>

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

                            </div>

                        </BlackoutBox>
                    </PopoverBody>
                </Popover>

            </div>

        );

    }

    private addRelatedTag(label: string) {

        const tag: Tag = {
            id: label,
            label
        };

        const tags = [tag, ...this.state.pendingTags];

        this.handleChange(TagOptions.fromTags(tags));

        // need or else the button has focus now...
        this.select!.focus();

    }

    private onCancel() {
        this.setState({...this.state, open: false});
    }

    private onDone() {

        this.setState({...this.state, open: false});

        const onChange = this.props.onChange || NULL_FUNCTION;

        // important to always call onChange even if we have no valid
        // tags as this is acceptable and we want to save these to
        // disk.

        onChange(this.state.pendingTags);

    }

    private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {

        if (event.key === "Escape") {
            this.onCancel();
        }

        if (event.getModifierState("Control") && event.key === "Enter") {
            this.onDone();
    }

    }

    private handleChange(selectedOptions: ReadonlyArray<TagOption>) {

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

        this.setState({...this.state, pendingTags: validTags});

    }

}

export interface IProps {

    readonly container?: string;

    readonly size?: 'sm' | 'md' | 'lg';

    readonly className?: string;

    readonly placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';

    /**
     * The tags that can be selected.
     */
    readonly availableTags: ReadonlyArray<Tag>;

    /**
     * The existing tags on this item.
     */
    readonly existingTags?: () => ReadonlyArray<Tag>;

    /**
     * The relatedTags index which is updated as the user selects new tags.
     */
    readonly relatedTags?: RelatedTagsManager;

    readonly onChange?: (values: ReadonlyArray<Tag>) => void;

}

interface IState {

    readonly open: boolean;

    /**
     * The tags that are actively being selected but not yet applied.
     */
    readonly pendingTags: ReadonlyArray<Tag>;


}

