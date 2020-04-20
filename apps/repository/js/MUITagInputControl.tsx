import * as React from 'react';
import {TagOption} from './TagOption';
import {TagOptions} from './TagOptions';
import {Tag, Tags} from 'polar-shared/src/tags/Tags';
import {Logger} from 'polar-shared/src/logger/Logger';
import {RelatedTagsManager} from '../../../web/js/tags/related/RelatedTagsManager';
import {Toaster} from '../../../web/js/ui/toaster/Toaster';
import {IDs} from '../../../web/js/util/IDs';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {PremiumFeature} from "../../../web/js/ui/premium_feature/PremiumFeature";
import {
    InheritedTag,
    isInheritedTag
} from "polar-shared/src/tags/InheritedTags";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import Chip from '@material-ui/core/Chip';
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import MUICreatableAutocomplete
    , {AutocompleteOption} from "../../../web/spectron0/material-ui/MUICreatableAutocomplete";
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

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

}

export interface BaseProps {

    readonly className?: string;

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

    readonly onChange: (values: ReadonlyArray<Tag>) => void;

    readonly onCancel: () => any;

}

export interface IProps extends BaseProps {

    readonly onDone: () => any;

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

    readonly pendingTagOptions: ReadonlyArray<AutocompleteOption<Tag>>;

    readonly relatedTags: ReadonlyArray<string>;

    readonly availableTagOptions: ReadonlyArray<AutocompleteOption<Tag>>;

    readonly createOption: (input: string) => AutocompleteOption<Tag>;

    readonly onKeyDown: (event: any) => any;

    readonly addRelatedTag: (item: string) => any;

    readonly handleChange: (selectedOptions: TagOption[]) => any;

    readonly onCancel: () => any;

    readonly onDone: () => any;

    readonly onChange: (values: ReadonlyArray<Tag>) => void;

}

const RelatedTagsWidget = (props: IRenderProps) => {

    if (props.relatedTags.length === 0) {
        return null;
    }

    return <Box>

        <Box pb={1}>
            <strong>Related tags: </strong>
        </Box>

        <RelatedTagsItems {...props}/>

    </Box>;

};

const DocTagsTagsWidget = (props: IRenderProps) => {

    if (props.docTags.length === 0) {
        return null;
    }

    const toChip = (tag: Tag) => (
        <div key={tag.id} className="mr-1">
            <Chip label={tag.label}/>
        </div>
    );

    return <Box mt={1}>

        <Box pt={1} pb={1}>
            <strong>Tags inherited from document: </strong>
        </Box>

        <div style={{display: 'flex'}}>
            {props.docTags.map(toChip)}
        </div>

    </Box>;

};

const RelatedTagsItems = (props: IRenderProps) => {

    return (
        <Grid container
              direction="row"
              justify="flex-start"
              alignItems="center"
              spacing={1}>
            {props.relatedTags.map(item =>
                <Grid item key={item}>
                    <Chip label={item}
                          onClick={() => props.addRelatedTag(item)}/>
                </Grid>)}
        </Grid>
    );

};


const TagInputBody = (props: IRenderProps) => {

    // FIXME: command+enter...

    return <Dialog open={props.open}
                   onClose={props.onCancel}>

            <DialogContent>

                {/*<div className="pt-1 pb-1">*/}
                {/*    <strong>Assign tags:</strong>*/}
                {/*</div>*/}

                <Box pt={1} pb={1}>

                    <MUICreatableAutocomplete label="Create or select tags ..."
                                              options={props.availableTagOptions}
                                              defaultOptions={props.pendingTagOptions}
                                              autoFocus
                                              // placeholder="Create or select tags ..."
                                              createOption={props.createOption}
                                              onChange={NULL_FUNCTION}/>

                </Box>

                <div className="pt-1">

                    <PremiumFeature required='bronze' size='sm' feature="related tags">
                        <RelatedTagsWidget {...props}/>
                    </PremiumFeature>

                </div>

                <DocTagsTagsWidget {...props}/>


            </DialogContent>

        <DialogActions>

            <Button size="large"
                    onClick={() => props.onCancel()}>
                Cancel
            </Button>

            <Button color="primary"
                    size="large"
                    variant="contained"
                    onClick={() => props.onDone()}>
                Done
            </Button>

        </DialogActions>

    </Dialog>;

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

export class MUITagInputControl extends React.Component<IProps, IState> {

    private readonly id = IDs.create("popover-");

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCancel = this.onCancel.bind(this);
        this.onDone = this.onDone.bind(this);

        this.handleChange = this.handleChange.bind(this);

        const existingTags = this.props.existingTags ? this.props.existingTags() : [];
        const pendingTags = TagUtils.selfTags(existingTags);
        const docTags = TagUtils.docTags(existingTags);

        this.state = {
            open: true,
            pendingTags, docTags
        };

    }

    public render() {

        if (! this.props.relatedTagsManager) {
            log.warn("No relatedTagsManager");
        }

        const relatedTagsManager = this.props.relatedTagsManager || new RelatedTagsManager();

        const availableTags = Tags.regularTagsThenFolderTagsSorted(this.props.availableTags);

        const toAutocompleteOption = (tag: Tag): AutocompleteOption<Tag> => {
            return {
                id: tag.id,
                label: tag.label,
                value: tag
            };
        };

        const availableTagOptions = availableTags.map(toAutocompleteOption);
        const pendingTags = Tags.onlyRegular(this.state.pendingTags).map(toAutocompleteOption);

        const createOption = (input: string): AutocompleteOption<Tag> => ({
            id: input,
            label: input,
            value: {
                id: input,
                label: input,
            }
        });

        const computeRelatedTags = () => {

            const input = [...this.state.pendingTags]
                            .map(current => current.label)
                            ;

            return relatedTagsManager.compute(input).map(current => current.tag);

        };

        const relatedTags: string[] = computeRelatedTags();

        return (

            <TagInputBody
                availableTagOptions={availableTagOptions}
                pendingTagOptions={pendingTags}
                relatedTags={relatedTags}
                handleChange={(selectedOptions) => this.handleChange(selectedOptions)}
                createOption={createOption}
                onKeyDown={NULL_FUNCTION}
                addRelatedTag={label => this.addRelatedTag(label)}
                {...this.props}
                {...this.state}
                onCancel={() => this.onCancel()}
                onDone={() => this.onDone()}/>

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
        // this.select!.focus();

    }

    private onCancel() {

        this.setState({
            ...this.state,
            open: false
        });

        this.props.onCancel();

    }

    private onDone() {

        this.setState({
            ...this.state,
            open: false
        });

        const onChange = this.props.onChange || NULL_FUNCTION;

        // important to always call onChange even if we have no valid
        // tags as this is acceptable and we want to save these to
        // disk.

        onChange(this.state.pendingTags);

        this.props.onDone();

    }

    // FIXME: make sure escape and enter work here...

    // private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    //
    //     if (event.key === "Escape") {
    //         this.onCancel();
    //     }
    //
    //     if (event.getModifierState("Control") && event.key === "Enter") {
    //         this.onDone();
    //     }
    //
    // }

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
