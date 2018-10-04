import * as React from 'react';
import {DocAnnotation} from './DocAnnotation';
import {AnnotationSidebars} from './AnnotationSidebars';
import Collapse from 'reactstrap/lib/Collapse';
import {AnnotationCommentBox} from './AnnotationCommentBox';

/**
 */
export class AnnotationControlBar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            activeInputComponent: 'none'
        };

    }

    public render() {
        const { annotation } = this.props;

        return (

            <div className="annotation-control-bar">

                <div className="annotation-buttons text-right border-top pt-1 pb-2">

                    <a className="text-muted ml-1"
                       href="#" onClick={() => this.changeActiveInputComponent('comment')}>
                        comment
                    </a>

                    <a className="text-muted ml-1"
                       href="#" onClick={() => AnnotationSidebars.scrollToAnnotation(annotation.id, annotation.pageNum)}>
                        context
                    </a>

                </div>

                <Collapse isOpen={this.state.activeInputComponent === 'comment'}>

                    <AnnotationCommentBox annotation={annotation}/>

                </Collapse>

            </div>

        );
    }

    private changeActiveInputComponent(activeInputComponent: ActiveInputComponent) {
        this.setState({
            activeInputComponent
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
