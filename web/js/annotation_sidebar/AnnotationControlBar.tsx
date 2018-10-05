import * as React from 'react';
import {DocAnnotation} from './DocAnnotation';
import {AnnotationSidebars} from './AnnotationSidebars';
import Collapse from 'reactstrap/lib/Collapse';
import {AnnotationCommentBox} from './AnnotationCommentBox';
import Moment from 'react-moment';
import {Comments} from '../metadata/Comments';
import {PageMeta} from '../metadata/PageMeta';
import {Refs} from '../metadata/Refs';

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
                           href="#" onClick={() => AnnotationSidebars.scrollToAnnotation(annotation.id, annotation.pageNum)}>
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

    private toggleActiveInputComponent(activeInputComponent: ActiveInputComponent) {
        this.setState({
            activeInputComponent: this.state.activeInputComponent === activeInputComponent ? 'none' : activeInputComponent
        });
    }

    private onComment(html: string) {

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
