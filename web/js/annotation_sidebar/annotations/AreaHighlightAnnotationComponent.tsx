import * as React from 'react';
import {DocAnnotation} from '../DocAnnotation';

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

            // FIXME: I need to figure out how to resolve the promise to the URL
            // here and whether we shouldn't remove the async framework as getFile
            // no longer needs to be async.

            return (
                <div key={key} className='area-highlight'>
                    {/*<img src={annotation.screenshot.src}/>*/}
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
