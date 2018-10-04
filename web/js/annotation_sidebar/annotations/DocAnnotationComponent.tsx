import * as React from 'react';
import {DocAnnotation} from '../DocAnnotation';

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class DocAnnotationComponent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {

        const { annotation } = this.props;

        if (annotation.screenshot) {
            return (
                <div key={annotation.id} className='area-highlight'>
                    <img src={annotation.screenshot.src}/>
                </div>
            );
        } else {
            return (
                <div key={annotation.id} className='area-highlight'>

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
