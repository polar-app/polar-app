import * as React from 'react';
import {RepoAnnotation} from '../RepoAnnotation';
import {ResponsiveImg} from '../../../../web/js/annotation_sidebar/ResponsiveImg';

export class AnnotationPreview extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {
        const {id, annotation} = this.props;
        const {img} = annotation;

        if (img) {

            return <ResponsiveImg id={this.props.id} img={img}/>;

        } else {
            return (
                <div id={this.props.id}>
                    <p>{annotation.text || 'no text'}</p>
                </div>
            );
        }

    }

}
interface IProps {
    readonly id: string;
    readonly annotation: RepoAnnotation;
}

interface IState {
}

