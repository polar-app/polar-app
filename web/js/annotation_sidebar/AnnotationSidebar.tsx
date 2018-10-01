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
import {AreaHighlightModel} from '../highlights/area/model/AreaHighlightModel';
import {MutationType} from '../proxies/MutationType';
import {TextHighlightModel} from '../highlights/text/model/TextHighlightModel';
import {isPresent} from '../Preconditions';

const log = Logger.create();

export class AnnotationSidebar extends React.Component<AnnotationSidebarProps, AnnotationSidebarState> {

    private docAnnotationIndex: DocAnnotationIndex = new DocAnnotationIndex();

    constructor(props: AnnotationSidebarProps, context: any) {
        super(props, context);

        this.scrollToAnnotation = this.scrollToAnnotation.bind(this);

        const annotations = DocAnnotations.getAnnotationsForPage(props.docMeta);

        this.docAnnotationIndex
            = DocAnnotationIndexes.rebuild(this.docAnnotationIndex, ...annotations);

        new AreaHighlightModel().registerListener(this.props.docMeta, annotationEvent => {

            const docAnnotation =
                this.convertAnnotation(annotationEvent.value,
                                       annotationValue => DocAnnotations.createFromAreaHighlight(annotationValue,
                                                                                                 annotationEvent.pageMeta));

            this.handleAnnotationEvent(annotationEvent.id,
                                       annotationEvent.traceEvent.mutationType,
                                       docAnnotation);

        });

        new TextHighlightModel().registerListener(this.props.docMeta, annotationEvent => {

            const docAnnotation =
                this.convertAnnotation(annotationEvent.value,
                                       annotationValue => DocAnnotations.createFromTextHighlight(annotationValue,
                                                                                                 annotationEvent.pageMeta));

            this.handleAnnotationEvent(annotationEvent.id,
                                       annotationEvent.traceEvent.mutationType,
                                       docAnnotation);
        });

        this.state = {
            annotations: this.docAnnotationIndex.sortedDocAnnotation
        };

    }

    private convertAnnotation<T>(value: any | undefined | null, converter: (input: any) => T) {

        if (! isPresent(value)) {
            return undefined;
        }

        return converter(value);

    }

    private handleAnnotationEvent(id: string,
                                  mutationType: MutationType,
                                  docAnnotation: DocAnnotation | undefined) {

        if (mutationType === MutationType.INITIAL) {
            // we already have the data properly.
            return;
        } else if (mutationType === MutationType.DELETE) {

            this.docAnnotationIndex
                = DocAnnotationIndexes.delete(this.docAnnotationIndex, id);

            this.reload();

        } else {
            this.refresh(docAnnotation!);
        }

    }

    private refresh(docAnnotation: DocAnnotation) {

        this.docAnnotationIndex
            = DocAnnotationIndexes.rebuild(this.docAnnotationIndex, docAnnotation);

        this.reload();

    }

    private reload() {

        this.setState({
            annotations: this.docAnnotationIndex.sortedDocAnnotation
        });

    }

    private scrollToAnnotation(id: string, pageNum: number) {

        const selector = `.page div[data-annotation-id='${id}']`;

        const pageElements: HTMLElement[] = Array.from(document.querySelectorAll(".page"));
        const pageElement = pageElements[pageNum - 1];

        if (!pageElement) {
            log.error(`Could not find page ${pageNum} of N pages: ${pageElements.length}`);
            return;
        }

        this.scrollToElement(pageElement);

        const annotationElement = document.querySelector(selector)! as HTMLElement;

        this.scrollToElement(annotationElement);

    }

    private scrollToElement(element: HTMLElement) {

        element.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });

    }

    private createHTML(annotations: DocAnnotation[]) {

        // https://blog.cloudboost.io/for-loops-in-react-render-no-you-didnt-6c9f4aa73778

        // TODO: I'm not sure what type of class a <div> or React element uses
        // so using 'any' for now.

        const result: any = [];

        annotations.map(annotation => {

            if (! isPresent(annotation.id)) {
                log.warn("No annotation id!", annotation);
                return;
            }

            const html = Optional.of(annotation.html).getOrElse('');

            // FIXME: these still do not render properly as we dont' get the
            // data from the store properly.

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

                // TODO: move this to a formatter function so this is a big cleaner.
                result.push(
                    <div className="border border-secondary rounded m-1 mb-2">
                        <div key={annotation.id}
                             data-annotation-id={annotation.id}
                             data-annotation-type={attrType}
                             data-annotation-color={annotation.color}
                             className={attrType}>

                            <blockquote className="p-1 rounded">

                                <span dangerouslySetInnerHTML={{__html: html}}>

                                </span>

                            </blockquote>

                            <div className="annotation-buttons text-right border-top">
                                <a className="text-muted"
                                   href="#" onClick={() => this.scrollToAnnotation(annotation.id, annotation.pageNum)}>
                                    context
                                </a>
                            </div>

                        </div>

                    </div>
                );

            }

        });

        return result;

    }

    public render() {
        const { annotations } = this.state;

        return (

            <div id="annotation-manager" className="annotation-sidebar">

                <div className="annotations">
                    {this.createHTML(annotations)}
                </div>

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

