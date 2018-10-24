import * as React from 'react';
import {DocAnnotation} from './DocAnnotation';
import {AnnotationSidebars} from './AnnotationSidebars';
import Collapse from 'reactstrap/lib/Collapse';
import {AnnotationCommentBox} from './AnnotationCommentBox';
import Moment from 'react-moment';
import {Comments} from '../metadata/Comments';
import {Refs} from '../metadata/Refs';
import {AnnotationFlashcardBox} from './AnnotationFlashcardBox';
import {HTMLString} from '../util/HTMLString';
import {Flashcards} from '../metadata/Flashcards';
import {IStyleMap} from '../react/IStyleMap';
import {AnnotationDropdown} from './AnnotationDropdown';
import {AnnotationType} from '../metadata/AnnotationType';
import {UncontrolledCollapse} from 'reactstrap';


const Styles: IStyleMap = {

    button: {
        paddingTop: '4px',
        color: 'red !important',
        fontSize: '15px'

        // minWidth: '350px',
        // width: '350px'
    },

    icon: {
        fontSize: '16px',
        color: '#a4a4a4'

        // minWidth: '350px',
        // width: '350px'
    }
};

/**
 */
export class AnnotationControlBar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCommentCreated.bind(this);

        this.state = {
            activeInputComponent: 'none'
        };

    }

    public render() {
        const { annotation } = this.props;

        return (

            <div className="annotation-control-bar">


                <div className="flexbar annotation-buttons border-top pt-1 pb-2">

                    <div className="text-muted annotation-context-link">
                        {/*TODO: make this into its own component... */}
                        <a href="#" onClick={() => this.onJumpToContext(annotation)}>
                            <Moment withTitle={true} titleFormat="D MMM YYYY hh:MM A" fromNow>
                                {annotation.created}
                            </Moment>
                        </a>
                    </div>


                    <div className="flexbar-right">

                        <a className="text-muted ml-2"
                           title="Create comment"
                           style={Styles.button}
                           href="#" onClick={() => this.toggleActiveInputComponent('comment')}>
                            <i style={Styles.icon}
                               className="fas fa-comment-alt"></i>
                        </a>

                        <a className="text-muted ml-2"
                           title="Create flashcard"
                           style={Styles.button}
                           href="#" onClick={() => this.toggleActiveInputComponent('flashcard')}>
                            <i style={Styles.icon}
                               className="fas fa-bolt"></i>
                        </a>

                        {/*<a className="text-muted ml-2"*/}
                           {/*title="Jump to annotation contet"*/}
                           {/*style={Styles.button}*/}
                           {/*href="#" */}
                           {/*onClick={() => this.onContext(annotation)}>*/}
                            {/*<i style={Styles.icon}*/}
                               {/*className="fas fa-bullseye"></i>*/}
                        {/*</a>*/}

                        <AnnotationDropdown id={'annotation-dropdown-' + annotation.id}
                                            annotation={annotation}
                                            onDelete={() => this.onDelete(annotation)}
                                            onCreateComment={(annotation) => this.toggleActiveInputComponent('comment')}
                                            onCreateFlashcard={() => this.toggleActiveInputComponent('flashcard')}
                                            onJumpToContext={() => this.onJumpToContext(annotation)}/>


                    </div>

                </div>

                <Collapse timeout={0} isOpen={this.state.activeInputComponent === 'comment'}>

                    <AnnotationCommentBox annotation={annotation}
                                          onCommentCreated={(html) => this.onCommentCreated(html)}/>

                </Collapse>

                <Collapse timeout={0} isOpen={this.state.activeInputComponent === 'flashcard'}>

                    <AnnotationFlashcardBox annotation={annotation}
                                            onFlashcardCreated={(front, back) => this.onFlashcardCreated(front, back)}/>

                </Collapse>

            </div>

        );
    }

    private onDelete(annotation: DocAnnotation) {

        if (annotation.annotationType === AnnotationType.TEXT_HIGHLIGHT) {
            delete annotation.pageMeta.textHighlights[annotation.id];
        }

        if (annotation.annotationType === AnnotationType.AREA_HIGHLIGHT) {
            delete annotation.pageMeta.areaHighlights[annotation.id];
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

    private onCommentCreated(html: string) {

        // sanitize the HTML first to prevent breaking the DOM and other
        // problematic issues with HTML.  Right now we don't handle any type of
        // XSS though

        // TODO: right now it seems to strip important CSS styles and data URLs
        // which I need to fix in the HTML sanitizer.
        // html = HTMLSanitizer.sanitize(html);

        const {annotation} = this.props;

        const ref = Refs.createFromAnnotationType(annotation.id,
                                                  annotation.annotationType);

        const comment = Comments.createHTMLComment(html, ref);
        annotation.pageMeta.comments[comment.id] = comment;

        this.setState({
            activeInputComponent: 'none'
        });

    }

    private onFlashcardCreated(front: HTMLString, back: HTMLString) {

        // TODO: right now it seems to strip important CSS styles and data URLs
        // which I need to fix in the HTML sanitizer.
        // html = HTMLSanitizer.sanitize(html);

        const {annotation} = this.props;

        const ref = Refs.createFromAnnotationType(annotation.id, annotation.annotationType);

        let flashcard = Flashcards.createFrontBack(front, back, ref);

        // TODO: an idiosyncracy of the proxies system is that it mutates the
        // object so if it's read only it won't work.  This is a bug with
        // Proxies so I need to also fix that bug there in the future.
        flashcard = Object.assign({}, flashcard);

        annotation.pageMeta.flashcards[flashcard.id] = flashcard;

        this.setState({
            activeInputComponent: 'none'
        });

    }

}
interface IProps {
    annotation: DocAnnotation;
}

interface IState {
    activeInputComponent: ActiveInputComponent;
}

type ActiveInputComponent = 'none' | 'comment' | 'flashcard';
