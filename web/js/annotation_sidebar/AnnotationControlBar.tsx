import * as React from 'react';
import {DocAnnotation} from './DocAnnotation';
import {AnnotationSidebars} from './AnnotationSidebars';
import {AnnotationDropdown} from './AnnotationDropdown';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import CommentIcon from '@material-ui/icons/Comment';
import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {
    ClozeFields,
    FrontAndBackFields
} from './child_annotations/flashcards/flashcard_input/FlashcardInputs';
import {Comment} from "../metadata/Comment";
import {CreateComment} from "./child_annotations/comments/CreateComment";
import {CommentActions} from "./child_annotations/comments/CommentActions";
import {CreateFlashcard} from './child_annotations/flashcards/CreateFlashcard';
import {FlashcardActions} from './child_annotations/flashcards/FlashcardActions';
import {Doc} from '../metadata/Doc';
import {ColorSelector} from '../ui/colors/ColorSelector';
import {TextHighlights} from '../metadata/TextHighlights';
import {AreaHighlights} from '../metadata/AreaHighlights';
import {DocAnnotationMoment} from "./DocAnnotationMoment";
import {DocAuthor} from "./DocAuthor";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {EditTextHighlight} from "./child_annotations/comments/EditTextHighlight";
import EditIcon from '@material-ui/icons/Edit';
import {Preconditions} from "polar-shared/src/Preconditions";
import {Analytics} from "../analytics/Analytics";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {AnnotationMutations} from "polar-shared/src/metadata/mutations/AnnotationMutations";
import IconButton from '@material-ui/core/IconButton';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import {MUIAnchor} from "../../spectron0/material-ui/MUIAnchor";
import {MUIGridLayout} from "../../spectron0/material-ui/dropdown_menu/MUIGridLayout";

// tslint:disable-next-line:variable-name



export class AnnotationControlBar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCommentCreated = this.onCommentCreated.bind(this);
        this.onColor = this.onColor.bind(this);

        this.onTextHighlightReset = this.onTextHighlightReset.bind(this);
        this.onTextHighlightEdited = this.onTextHighlightEdited.bind(this);
        this.onTagged = this.onTagged.bind(this);

        this.state = {
            activeInputComponent: 'none'
        };

    }

    public render() {

        const { annotation } = this.props;

        const ChangeTextHighlightButton = () => {

            if (this.props.annotation.annotationType !== AnnotationType.TEXT_HIGHLIGHT) {
                // this should only be added on text highlights.
                return null;
            }

            return (
                <IconButton disabled={! this.props.doc.mutable}
                            size="small"
                            onClick={() => this.toggleActiveInputComponent('text-highlight')}>

                    <EditIcon/>

                </IconButton>
            );
        };

        const CreateCommentButton = () => {
            return (
                <IconButton disabled={! this.props.doc.mutable}
                            size="small"
                            onClick={() => this.toggleActiveInputComponent('comment')}>

                    <CommentIcon/>

                </IconButton>
            );
        };

        const CreateFlashcardButton = () => {
            return (
                <IconButton disabled={! this.props.doc.mutable}
                            size="small"
                            onClick={() => this.toggleActiveInputComponent('flashcard')}>

                    <FlashOnIcon/>

                </IconButton>
            );
        };

        return (

            <div style={{userSelect: 'none'}}
                 className="pt-1">

                <div style={{display: 'flex'}}>

                    <MUIGridLayout items={[
                        <DocAuthor key="author" author={annotation.author}/>,

                        <MUIAnchor key="moment"
                                   href="#"
                                   onClick={() => this.onJumpToContext(annotation)}>
                            <DocAnnotationMoment created={annotation.created}/>
                        </MUIAnchor>

                    ]}/>

                    <MUIGridLayout style={{
                                      justifyContent: 'flex-end',
                                      flexGrow: 1
                                   }}
                                   items={[
                                       <ChangeTextHighlightButton key="highlight-button"/>,
                                       <CreateCommentButton key="comment-button"/>,
                                       <CreateFlashcardButton key="flashcard-button"/>,
                                       <>
                                            {! annotation.immutable &&
                                                <ColorSelector key="color-selector"
                                                               color={this.props.annotation.color || 'yellow'}
                                                               onSelected={color => this.onColor(color)}/>}
                                       </>,
                                       <AnnotationDropdown key="annotation-dropdown"
                                                           id={'annotation-dropdown-' + annotation.id}
                                                           disabled={this.props.annotation.immutable}
                                                           annotation={annotation}
                                                           onDelete={() => this.onDelete(annotation)}
                                                           onCreateComment={() => this.toggleActiveInputComponent('comment')}
                                                           onCreateFlashcard={() => this.toggleActiveInputComponent('flashcard')}
                                                           onJumpToContext={() => this.onJumpToContext(annotation)}/>
                                   ]}/>
                        {/*TODO: make these a button with a 'light' color and size of 'sm'*/}


                        {/*<TagInputControl className='ml-1 p-1 text-muted'*/}
                        {/*                 container="body"*/}
                        {/*                 availableTags={this.props.tagsProvider()}*/}
                        {/*                 existingTags={() => annotation.tags ? Object.values(annotation.tags) : []}*/}
                        {/*                 onChange={(tags) => this.onTagged(tags)}/>*/}

                </div>

                <EditTextHighlight id={annotation.id}
                                   hidden={this.props.annotation.annotationType !== AnnotationType.TEXT_HIGHLIGHT}
                                   active={this.state.activeInputComponent === 'text-highlight'}
                                   html={this.props.annotation.html || ""}
                                   onReset={() => this.onTextHighlightReset()}
                                   onChanged={text => this.onTextHighlightEdited(text)}
                                   onCancel={() => this.toggleActiveInputComponent('none')}/>

                <CreateComment id={annotation.id}
                               active={this.state.activeInputComponent === 'comment'}
                               onCancel={() => this.toggleActiveInputComponent('none')}
                               onComment={(html) => this.onCommentCreated(html)}/>

                {this.state.activeInputComponent === 'flashcard' &&
                    <CreateFlashcard id={annotation.id}
                                     defaultValue={this.props.annotation.html}
                                     onCancel={() => this.toggleActiveInputComponent('none')}
                                     onFlashcardCreated={(type, fields) => this.onFlashcardCreated(type, fields)}/>}

            </div>

        );
    }

    private onTagged(tags: ReadonlyArray<Tag>) {

        setTimeout(() => {

            const {annotation} = this.props;
            const {docMeta} = annotation;

            const updates = {tags: Tags.toMap(tags)};

            AnnotationMutations.update(docMeta,
                                       annotation.annotationType,
                                       {...annotation.original, ...updates});

        }, 1);

    }

    private onTextHighlightReset() {
        const {annotation, doc} = this.props;

        setTimeout(() => {
            TextHighlights.resetRevisedText(doc.docMeta, annotation.pageMeta, annotation.id);
            this.toggleActiveInputComponent('none');
        }, 1);
    }

    private onTextHighlightEdited(text: string) {
        const {annotation, doc} = this.props;

        setTimeout(() => {
            TextHighlights.setRevisedText(doc.docMeta, annotation.pageMeta, annotation.id, text);
            this.toggleActiveInputComponent('none');
        }, 1);

    }

    private onColor(color: HighlightColor) {

        setTimeout(() => {

            const {annotation} = this.props;

            if (annotation.annotationType === AnnotationType.TEXT_HIGHLIGHT) {
                TextHighlights.update(annotation.id, annotation.docMeta, annotation.pageMeta, {color});
            }

            if (annotation.annotationType === AnnotationType.AREA_HIGHLIGHT) {
                AreaHighlights.update(annotation.id, annotation.docMeta, annotation.pageMeta, {color});
            }

        }, 1);
    }

    private onDelete(annotation: DocAnnotation) {

        Preconditions.assertPresent(annotation);

        switch (annotation.annotationType) {
            case AnnotationType.TEXT_HIGHLIGHT:
                delete annotation.pageMeta.textHighlights[annotation.id];
                break;
            case AnnotationType.AREA_HIGHLIGHT:
                delete annotation.pageMeta.areaHighlights[annotation.id];
                break;
            default:
                break;
        }

    }

    private onJumpToContext(annotation: DocAnnotation) {
        AnnotationSidebars.scrollToAnnotation(annotation.id, annotation.pageNum);
    }

    private toggleActiveInputComponent(activeInputComponent: ActiveInputComponent) {
        this.setState({
            activeInputComponent: this.state.activeInputComponent === activeInputComponent ? 'none' : activeInputComponent
        });
    }

    private onCommentCreated(html: string, existingComment?: Comment) {

        Analytics.event({category: 'annotations', action: 'comment-created'});

        // sanitize the HTML first to prevent breaking the DOM and other
        // problematic issues with HTML.  Right now we don't handle any type of
        // XSS though

        // TODO: right now it seems to strip important CSS styles and data URLs
        // which I need to fix in the HTML sanitizer.
        // html = HTMLSanitizer.sanitize(html);

        // FIXME: nothing is actually persisted here...

        CommentActions.create(this.props.doc.docMeta, this.props.annotation, html);

        // FIXME: nothing is actually persisted here...

        this.setState({
            activeInputComponent: 'none'
        });

    }

    private onFlashcardCreated(type: FlashcardType, fields: FrontAndBackFields | ClozeFields) {

        Analytics.event({category: 'annotations', action: 'flashcard-created'});

        FlashcardActions.create(this.props.annotation, type, fields);

        // FIXME: nothing is actually persisted here...

        this.setState({
            activeInputComponent: 'none'
        });

    }

}
interface IProps {
    readonly doc: Doc;
    readonly tagsProvider: () => ReadonlyArray<Tag>;
    readonly annotation: DocAnnotation;
}

interface IState {
    activeInputComponent: ActiveInputComponent;
}

type ActiveInputComponent = 'none' | 'comment' | 'flashcard' | 'text-highlight';
