import * as React from 'react';
import {AnnotationTypes} from '../../metadata/AnnotationTypes';
import {DocAnnotation} from '../DocAnnotation';
import {Optional} from '../../util/ts/Optional';
import {AnnotationSidebars} from '../AnnotationSidebars';

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class AreaHighlightAnnotationComponent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {
        const { annotation } = this.props;

        const key = 'area-highlight' + annotation.id;

        if (annotation.screenshot) {
            return (
                <div key={key} className='area-highlight'>
                    <img src={annotation.screenshot.src}/>
                </div>
            );
        } else {
            return (
                <div key={key} className='area-highlight'>

                </div>
            );
        }

    }

}
interface IProps {
    annotation: DocAnnotation;
}

interface IState {

}
