import * as React from 'react';
import {RepoAnnotation} from '../RepoAnnotation';
import {ResponsiveImg} from '../../../../web/js/annotation_sidebar/ResponsiveImg';
import {DateTimeTableCell} from '../DateTimeTableCell';

const Body = (props: IProps) => {

    const {id, annotation} = props;
    const {img} = annotation;

    if (img) {

        return <ResponsiveImg id={props.id} img={img} defaultText=" "/>;

    } else {
        return (
            <div id={props.id}>
                <div>{annotation.text || 'no text'}</div>
            </div>
        );
    }

};

export class AnnotationPreview extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {

        return <div id={this.props.id}>

            <Body {...this.props}/>

            <DateTimeTableCell datetime={this.props.annotation.created} className="text-muted text-xs"/>

        </div>;

    }

}
interface IProps {
    readonly id: string;
    readonly annotation: RepoAnnotation;
}

interface IState {
}

