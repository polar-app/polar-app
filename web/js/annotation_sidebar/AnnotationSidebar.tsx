import * as React from 'react';
import {Logger} from '../logger/Logger';
import {DocMeta} from '../metadata/DocMeta';
import {AnnotationType} from '../metadata/AnnotationType';
import {Optional} from '../util/ts/Optional';
import {DocAnnotations} from './DocAnnotations';
import {AnnotationTypes} from '../metadata/AnnotationTypes';
import {DocAnnotation} from './DocAnnotation';

const log = Logger.create();

export class AnnotationSidebar extends React.Component<AnnotationSidebarProps, AnnotationSidebarState> {

    constructor(props: AnnotationSidebarProps, context: any) {
        super(props, context);

        const annotations = DocAnnotations.getAnnotationsForPage(props.docMeta);

        this.state = {
            annotations
        };

    }



    private createHTML(annotations: DocAnnotation[]) {

        // https://blog.cloudboost.io/for-loops-in-react-render-no-you-didnt-6c9f4aa73778

        // TODO: I'm not sure what type of class a <div> or React element uses
        // so using 'any' for now.

        const result: any = [];

        annotations.map(annotation => {

            const html = Optional.of(annotation.html).getOrElse('');

            if (annotation.annotationType === AnnotationType.AREA_HIGHLIGHT) {

                if (annotation.screenshot) {
                    result.push(
                        <div key={annotation.id} className='area-highlight'>
                            <img src={annotation.screenshot.src}/>
                        </div>);
                }

            } else {

                // if (annotation.screenshot) {
                //     result.push(
                //         <div key={`screenshot:${annotation.id}`} className='area-highlight'>
                //             <img src={annotation.screenshot.src}/>
                //         </div>);
                // }
                //

                const attrType = AnnotationTypes.toDataAttribute(annotation.annotationType);

                result.push(
                    <div key={annotation.id}
                                 data-annotation-id={annotation.id}
                                 data-annotation-type={attrType}
                                 className={attrType}>

                        <blockquote dangerouslySetInnerHTML={{__html: html}}>

                        </blockquote>

                    </div>);

            }

        });

        return result;

    }

    public render() {
        const { annotations } = this.state;
        return (

            <div id="annotation-manager" className="annotation-sidebar">

                {this.createHTML(annotations)}

            </div>

        );
    }

}

export interface AnnotationSidebarState {

    annotations: DocAnnotation[];
}


export interface AnnotationSidebarProps {
    readonly docMeta: DocMeta;
}

