import * as React from 'react';
import {DocAnnotation} from './DocAnnotation';
import {AnnotationSidebars} from './AnnotationSidebars';
import Collapse from 'reactstrap/lib/Collapse';
import {AnnotationCommentBox} from './AnnotationCommentBox';
import Moment from 'react-moment';
import {Comments} from '../metadata/Comments';
import {PageMeta} from '../metadata/PageMeta';
import {Refs} from '../metadata/Refs';
import {HTMLSanitizer} from '../highlights/text/selection/HTMLSanitizer';
import {Annotation} from '../metadata/Annotation';

/**
 */
export class AnnotationControlBar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onComment.bind(this);

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
                           href="#" onClick={() => this.toggleActiveInputComponent('comment')}>
                            comment
                        </a>

                        <a className="text-muted ml-2"
                           href="#" onClick={() => this.onContext(annotation)}>
                            context
                        </a>

                    </div>

                </div>

                <Collapse isOpen={this.state.activeInputComponent === 'comment'}>

                    <AnnotationCommentBox annotation={annotation}
                                          onComment={(html) => this.onComment(html)}/>

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

    private onComment(html: string) {

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

}
interface IProps {
    annotation: DocAnnotation;
}

interface IState {
    activeInputComponent: ActiveInputComponent;
}

type ActiveInputComponent = 'none' | 'comment';
