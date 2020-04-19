import * as React from 'react';
import CreatableSelect from 'react-select/creatable';
import {TagOption} from './TagOption';
import {TagOptions} from './TagOptions';
import {Tag, Tags} from 'polar-shared/src/tags/Tags';
import {Logger} from 'polar-shared/src/logger/Logger';
import {RelatedTagsManager} from '../../../web/js/tags/related/RelatedTagsManager';
import Button from 'reactstrap/lib/Button';
import {Toaster} from '../../../web/js/ui/toaster/Toaster';
import {IDs} from '../../../web/js/util/IDs';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {PremiumFeature} from "../../../web/js/ui/premium_feature/PremiumFeature";
import {Lightbox} from "../../../web/js/ui/util/Lightbox";
import {
    InheritedTag,
    isInheritedTag
} from "polar-shared/src/tags/InheritedTags";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {TagChicklet} from "../../../web/js/ui/tags/TagChicklet";

const log = Logger.create();

class Styles {

    public static popover: React.CSSProperties = {
        backgroundColor: 'var(--primary-background-color)',
        width: '500px !important',
        maxWidth: '9999px !important'
    };

    public static label: React.CSSProperties = {
        fontWeight: 'bold'
    };

    public static relatedTags: React.CSSProperties = {
        display: 'flex',
    };

    public static relatedTagsLabel: React.CSSProperties = {
        marginTop: 'auto',
        marginBottom: 'auto'
    };

    public static relatedTag: React.CSSProperties = {
        display: 'inline-block',
        backgroundColor: 'var(--grey100)',
        color: 'hsl(0,0%,20%)',
        fontSize: '12px',
        padding: '3px',
        paddingTop: '5px',
        marginTop: 'auto',
        marginBottom: 'auto'
    };

    public static button: React.CSSProperties = {
        fontSize: '14px'
    };

}

interface IProps {

    readonly size?: 'sm' | 'md' | 'lg';

    readonly className?: string;

    readonly container?: string;

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
    readonly relatedTagsManager?: RelatedTagsManager;

    readonly onChange?: (values: ReadonlyArray<Tag>) => void;

}

interface IState {

    readonly open: boolean;

    /**
     * The tags that are actively being selected but not yet applied.
     */
    readonly pendingTags: ReadonlyArray<Tag>;

    readonly docTags: ReadonlyArray<Tag>;

}

interface IRenderProps extends IState, IProps {

    readonly pendingTagOptions: ReadonlyArray<TagOption>;

    readonly relatedTags: ReadonlyArray<string>;

    readonly availableTagOptions: ReadonlyArray<TagOption>;

    readonly onKeyDown: (event: any) => any;

    readonly addRelatedTag: (item: string) => any;

    readonly handleChange: (selectedOptions: TagOption[]) => any;

    readonly onCancel: () => any;

    readonly onDone: () => any;

    readonly onChange?: (values: ReadonlyArray<Tag>) => void;

    readonly onSelect: (select: CreatableSelect<TagOption> | null) => void;

}

const RelatedTagsWidget = (props: IRenderProps) => {

    if (props.relatedTags.length === 0) {
        return null;
    }

    return <div style={Styles.relatedTags}>
        <div className="mr-1 pt-1"
             style={Styles.relatedTagsLabel}>
            <strong>Related tags: </strong>
        </div>
        <RelatedTagsItems {...props}/>
    </div>;

};

const DocTagsTagsWidget = (props: IRenderProps) => {

    if (props.docTags.length === 0) {
        return null;
    }

    const toTagChicklet = (tag: Tag) => (
        <div key={tag.id} className="mr-1">
            <TagChicklet>
                {tag.label}
            </TagChicklet>
        </div>
    );

    return <div className="mt-1">

        <div className="mr-1 pt-1 pb-1"
             style={Styles.relatedTagsLabel}>
            <strong>Tags inherited from document: </strong>
        </div>

        <div style={{display: 'flex'}}>
            {props.docTags.map(toTagChicklet)}
        </div>

    </div>;

};

const RelatedTagsItems = (props: IRenderProps) => {
    return <span>
                {props.relatedTags.map(item =>
                    <Button className="mr-1"
                            key={item}
                            style={{...Styles.relatedTag}}
                            color="light"
                            size={props.size || 'sm'}
                            onClick={() => props.addRelatedTag(item)}>{item}</Button>)}
            </span>;

};


const TagInputBody = (props: IRenderProps) => {

    if (! props.open) {
        return null;
    }

    return <Lightbox container={props.container}>

        <div style={{
                 width: '500px',
                 maxWidth: 'calc(100vw - 5px)',
                 backgroundColor: 'var(--primary-background-color)',
                 color: 'var(--primary-text-color)',
                 borderRadius: '5px'
             }}
             className="">

            <div className="p-2">

                <div className="pt-1 pb-1">
                    <strong>Assign tags:</strong>
                </div>

                <CreatableSelect
                    isMulti
                    isClearable
                    autoFocus
                    onKeyDown={event => props.onKeyDown(event)}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(selectedOptions) => props.handleChange(selectedOptions as TagOption[])}
                    value={props.pendingTagOptions}
                    defaultValue={props.pendingTagOptions}
                    placeholder="Create or select tags ..."
                    options={props.availableTagOptions}
                    ref={ref => props.onSelect(ref)}
                    // onKeyDown={() => console.log("FIXME onKeyDown1")}
                    // onKeyPress={() => console.log("FIXME onKeyPress1")}
                    />

                <div className="pt-1">

                    <PremiumFeature required='bronze' size='sm' feature="related tags">
                        <RelatedTagsWidget {...props}/>
                    </PremiumFeature>

                </div>

                <DocTagsTagsWidget {...props}/>

                <div className="mt-2">

                    <div style={{display: 'flex'}}>

                        <div className="ml-auto"/>

                        <Button color="clear"
                                size="sm"
                                style={Styles.button}
                                onClick={() => props.onCancel()}>
                            Cancel
                        </Button>

                        <div className="ml-1"/>

                        <Button color="primary"
                                size="sm"
                                style={Styles.button}
                                onClick={() => props.onDone()}>
                            Done
                        </Button>
                    </div>
                </div>

            </div>

        </div>
    </Lightbox>;

};

class TagUtils {

    public static docTags(tags: ReadonlyArray<Tag> | ReadonlyArray<InheritedTag>) {

        return arrayStream(tags)
            .filter(current => isInheritedTag(current) && current.source === 'doc')
            .collect();

    }

    public static selfTags(tags: ReadonlyArray<Tag> | ReadonlyArray<InheritedTag>) {

        const isSelfTag = (tag: Tag | InheritedTag): boolean => {

            if (isInheritedTag(tag)) {
                return tag.source === 'self';
            }

            // it's just a regular tag and we should assume that it's a self tag.
            return true;

        };

        return arrayStream(tags)
            .filter(isSelfTag)
            .collect();

    }


}

export class TagInputControl extends React.Component<IProps, IState> {

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
            pendingTags: [],
            docTags: []
        };

    }

    private activate() {

        const existingTags = this.props.existingTags ? this.props.existingTags() : [];
        const pendingTags = TagUtils.selfTags(existingTags);
        const docTags = TagUtils.docTags(existingTags);
        this.setState({
            open: true,
            pendingTags, docTags
        });

    }

    private deactivate() {
        this.setState({open: false});
    }

    public render() {

        const relatedTagsManager = this.props.relatedTagsManager || new RelatedTagsManager();

        const availableTags = Tags.regularTagsThenFolderTagsSorted(this.props.availableTags);
        const availableTagOptions = TagOptions.fromTags(availableTags, true);

        const pendingTags = TagOptions.fromTags(this.state.pendingTags);

        const computeRelatedTags = () => {

            const input = [...this.state.pendingTags]
                            .map(current => current.label)
                            ;

            return relatedTagsManager.compute(input).map(current => current.tag);

        };

        const relatedTags: string[] = computeRelatedTags();

        return (

            <div className="mt-auto mb-auto">

                <Button id={this.id}
                        onClick={() => this.activate()}
                        color="clear"
                        size={this.props.size}
                        style={{
                            lineHeight: 1.0
                        }}
                        className={this.props.className || ''}>
                    <span className="fas fa-tag"/>
                </Button>

                <TagInputBody
                    availableTagOptions={availableTagOptions}
                    pendingTagOptions={pendingTags}
                    relatedTags={relatedTags}
                    handleChange={(selectedOptions) => this.handleChange(selectedOptions)}
                    onKeyDown={(event) => this.onKeyDown(event)}
                    addRelatedTag={label => this.addRelatedTag(label)}
                    onCancel={() => this.onCancel()}
                    onDone={() => this.onDone()}
                    onSelect={select => this.select = select}
                    {...this.props}
                    {...this.state}/>

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
