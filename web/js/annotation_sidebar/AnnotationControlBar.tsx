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

                    <div className="text-muted">
                        {/*TODO: make this into its own component... */}
                        <Moment withTitle={true} titleFormat="D MMM YYYY hh:MM A" fromNow>
                            {annotation.created}
                        </Moment>
                    </div>

                    <div className="flexbar-right">

                        <a className="text-muted ml-2"
                           title="Create comment"
                           href="#" onClick={() => this.toggleActiveInputComponent('comment')}>
                            <i className="fas fa-comment-alt"></i>
                        </a>

                        <a className="text-muted ml-2"
                           title="Create flashcard"
                           href="#" onClick={() => this.toggleActiveInputComponent('flashcard')}>
                            <i className="fas fa-bolt"></i>
                        </a>

                        <a className="text-muted ml-2"
                           title="Jump to annotation contet"
                           href="#" onClick={() => this.onContext(annotation)}>
                            <i className="fas fa-bullseye"></i>
                        </a>

                    </div>

                </div>

                <Collapse isOpen={this.state.activeInputComponent === 'comment'}>

                    <AnnotationCommentBox annotation={annotation}
                                          onCommentCreated={(html) => this.onCommentCreated(html)}/>

                </Collapse>

                <Collapse isOpen={this.state.activeInputComponent === 'flashcard'}>

                    <AnnotationFlashcardBox annotation={annotation}
                                            onFlashcardCreated={(front, back) => this.onFlashcardCreated(front, back)}/>

                </Collapse>

            </div>

        );
    }

    private onContext(annotation: DocAnnotation) {

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
