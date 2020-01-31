import * as React from 'react';
import {DocAnnotation} from './DocAnnotation';
import {AnnotationSidebars} from './AnnotationSidebars';
import {IStyleMap} from '../react/IStyleMap';
import {AnnotationDropdown} from './AnnotationDropdown';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {Button} from 'reactstrap';
import {CommentIcon} from '../ui/standard_icons/CommentIcon';
import {FlashcardIcon} from '../ui/standard_icons/FlashcardIcon';
import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {ClozeFields, FrontAndBackFields} from './child_annotations/flashcards/flashcard_input/FlashcardInputs';
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
import {NullCollapse} from "../ui/null_collapse/NullCollapse";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {EditTextHighlight} from "./child_annotations/comments/EditTextHighlight";
import {EditIcon} from "../ui/standard_icons/EditIcon";
import {Preconditions} from "polar-shared/src/Preconditions";
import {Analytics} from "../analytics/Analytics";

const Styles: IStyleMap = {

    button: {
        marginTop: 'auto',
        marginBottom: 'auto',
        color: 'red !important',
        fontSize: '15px'

        // minWidth: '350px',
        // width: '350px'
    },

    barBody: {
        display: 'flex'
    },

    barChild: {
        marginTop: 'auto',
        marginBottom: 'auto',
    }

};

export class AnnotationControlBar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCommentCreated = this.onCommentCreated.bind(this);
        this.onColor = this.onColor.bind(this);

        this.onTextHighlightReset = this.onTextHighlightReset.bind(this);
        this.onTextHighlightEdited = this.onTextHighlightEdited.bind(this);

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

            return <Button className="text-muted p-1"
                           title="Edit text highlight"
                           size="sm"
                           color="clear"
                           style={Styles.button}
                           disabled={! this.props.doc.mutable}
                           onClick={() => this.toggleActiveInputComponent('text-highlight')}>

                <EditIcon/>

            </Button>;
        };

        const CreateCommentButton = () => {
            return <Button className="ml-1 text-muted p-1"
                           title="Create comment"
                           size="sm"
                           color="clear"
                           style={Styles.button}
                           disabled={! this.props.doc.mutable}
                           onClick={() => this.toggleActiveInputComponent('comment')}>

                <CommentIcon/>

            </Button>;
        };

        const CreateFlashcardButton = () => {
            return <Button className="ml-1 text-muted p-1"
                    title="Create flashcard"
                    style={Styles.button}
                    size="sm"
                    color="clear"
                    disabled={! this.props.doc.mutable}
                    onClick={() => this.toggleActiveInputComponent('flashcard')}>

                <FlashcardIcon/>

            </Button>;
        };

        return (

            <div style={{userSelect: 'none'}}
                 className="annotation-control-bar mb-3">

                <div style={Styles.barBody}
                     className="flexbar annotation-buttons border-bottom pt-0 pb-0">

                    <DocAuthor author={annotation.author}/>

                    <div style={Styles.barChild}
                         className="text-muted annotation-context-link">
                        {/*TODO: make this into its own component... */}
                        <a href="#" onClick={() => this.onJumpToContext(annotation)}>
                            <DocAnnotationMoment created={annotation.created}/>
                        </a>
                    </div>

                    <div style={Styles.barChild}
                         className="flexbar-right muted-color">

                        {/*TODO: make these a button with a 'light' color and size of 'sm'*/}

                        <ChangeTextHighlightButton/>

                        <CreateCommentButton/>

                        <CreateFlashcardButton/>

                        <NullCollapse open={!annotation.immutable}>
                            <ColorSelector className="mt-auto mb-auto muted-color-target-bg"
                                           size='16px'
                                           color={this.props.annotation.color || 'yellow'}
                                           onSelected={color => this.onColor(color)}/>
                        </NullCollapse>

                        <div className="ml-1">
                            <AnnotationDropdown id={'annotation-dropdown-' + annotation.id}
                                                disabled={this.props.annotation.immutable}
                                                annotation={annotation}
                                                onDelete={() => this.onDelete(annotation)}
                                                onCreateComment={() => this.toggleActiveInputComponent('comment')}
                                                onCreateFlashcard={() => this.toggleActiveInputComponent('flashcard')}
                                                onJumpToContext={() => this.onJumpToContext(annotation)}/>
                        </div>

                    </div>

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

                <CreateFlashcard id={annotation.id}
                                 active={this.state.activeInputComponent === 'flashcard'}
                                 defaultValue={this.props.annotation.html}
                                 onCancel={() => this.toggleActiveInputComponent('none')}
                                 onFlashcardCreated={(type, fields) => this.onFlashcardCreated(type, fields)}/>

            </div>

        );
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

        CommentActions.create(this.props.doc.docMeta, this.props.annotation, html);

        this.setState({
            activeInputComponent: 'none'
        });

    }

    private onFlashcardCreated(type: FlashcardType, fields: FrontAndBackFields | ClozeFields) {

        Analytics.event({category: 'annotations', action: 'flashcard-created'});

        FlashcardActions.create(this.props.annotation, type, fields);

        this.setState({
            activeInputComponent: 'none'
        });

    }

}
interface IProps {
    readonly doc: Doc;
    readonly annotation: DocAnnotation;
}

interface IState {
    activeInputComponent: ActiveInputComponent;
}

type ActiveInputComponent = 'none' | 'comment' | 'flashcard' | 'text-highlight';
