import * as React from 'react';
import {Logger} from '../logger/Logger';
import {DocMeta} from '../metadata/DocMeta';
import {AnnotationType} from '../metadata/AnnotationType';
import {Optional} from '../util/ts/Optional';
import {DocAnnotations} from './DocAnnotations';
import {AnnotationTypes} from '../metadata/AnnotationTypes';
import {DocAnnotation} from './DocAnnotation';
import {DocAnnotationIndex} from './DocAnnotationIndex';
import {DocAnnotationIndexes} from './DocAnnotationIndexes';
import {DocAnnotationsModel} from './DocAnnotationsModel';
import {AreaHighlightModel} from '../highlights/area/model/AreaHighlightModel';
import {AreaHighlight} from '../metadata/AreaHighlight';
import {TextHighlight} from '../metadata/TextHighlight';
import {MutationType} from '../proxies/MutationType';

const log = Logger.create();

export class AnnotationSidebar extends React.Component<AnnotationSidebarProps, AnnotationSidebarState> {

    private docAnnotationIndex: DocAnnotationIndex = new DocAnnotationIndex();

    constructor(props: AnnotationSidebarProps, context: any) {
        super(props, context);

        const annotations = DocAnnotations.getAnnotationsForPage(props.docMeta);

        console.log("FIXME1", annotations)

        this.docAnnotationIndex
            = DocAnnotationIndexes.rebuild(this.docAnnotationIndex, ...annotations);

        console.log("FIXME2", this.docAnnotationIndex);

        const docAnnotationsModel = new DocAnnotationsModel();

        new AreaHighlightModel().registerListener(this.props.docMeta, annotationEvent => {

            if (annotationEvent.traceEvent.mutationType === MutationType.INITIAL) {
                return;
            }

            const areaHighlight: AreaHighlight = annotationEvent.value;
            const docAnnotation = DocAnnotations.createFromAreaHighlight(areaHighlight, annotationEvent.pageMeta);
            this.refresh(docAnnotation);

        });

        docAnnotationsModel.registerListener(this.props.docMeta, annotationEvent => {

            if (annotationEvent.traceEvent.mutationType === MutationType.INITIAL) {
                return;
            }

            const textHighlight: TextHighlight = annotationEvent.value;
            const docAnnotation = DocAnnotations.createFromAreaHighlight(textHighlight, annotationEvent.pageMeta);
            this.refresh(docAnnotation);
        });


        // FIUXME: we're not geting any docs.


        this.state = {
            annotations: this.docAnnotationIndex.sortedDocAnnotation
        };

    }

    private refresh(docAnnotation: DocAnnotation) {

        this.docAnnotationIndex
            = DocAnnotationIndexes.rebuild(this.docAnnotationIndex, docAnnotation);

        this.reload();

    }

    private reload() {

        console.log("FIXME: reloading");

        this.setState({
            annotations: this.docAnnotationIndex.sortedDocAnnotation
        });

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

                // TODO: move this to a formatter function
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

