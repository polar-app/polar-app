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

    private scrollToAnnotation(id: string) {

        const annotationElement =
            document.querySelector(`div[data-annotation-id='${id}']`)! as HTMLElement;

        // annotationElement.scrollIntoView({
        //     behavior: 'smooth'
        // });

        // const scrollParent = this.getScrollParent(annotationElement);
        // console.log("FIXME: ", scrollParent)
        // scrollParent!.scrollBy(0, 50);


        // scrollIntoView(annotationElement);

        // annotationElement.scrollIntoView({behavior: "instant", block: "end", inline: "nearest"});

        // annotationElement.scrollIntoView(false);

        // this.scrollToElementMiddle(annotationElement);

    }

    //
    // private getScrollParent(node: HTMLElement | null | undefined): HTMLElement | undefined {
    //
    //     if (node === null || node === undefined) {
    //         return undefined;
    //     }
    //
    //     if (node.scrollHeight > node.clientHeight) {
    //         return node;
    //     } else {
    //         return this.getScrollParent(node.parentElement);
    //     }
    // }

    // private getScrollParent(element: HTMLElement, includeHidden: boolean = false) {
    //
    //     let style = getComputedStyle(element);
    //     const excludeStaticParent = style.position === "absolute";
    //     const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
    //
    //     if (style.position === "fixed") {
    //         return document.body;
    //     }
    //
    //     // noinspection TsLint
    //     for (let parent: HTMLElement | null = element; (parent = parent.parentElement);) {
    //
    //         style = getComputedStyle(parent)!;
    //
    //         if (excludeStaticParent && style.position === "static") {
    //             continue;
    //         }
    //
    //         if (overflowRegex.test(style.overflow! + style.overflowY + style.overflowX)) {
    //             return parent;
    //         }
    //
    //     }
    //
    //     return document.body;
    // }

    private scrollToElementMiddle(element: HTMLElement) {
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top;
        // align type
        const middleDiff = (elementRect.height / 2);
        // 要素の中心のY座標
        const scrollTopOfElement = absoluteElementTop + middleDiff;
        // 画面半分を引くと、要素の中心が、画面の中央になる
        const scrollY = Math.floor(scrollTopOfElement - (window.innerHeight / 2));

        element.parentElement!.scrollTo(0, scrollY);
        // window.scrollTo();
        console.log("scrolled to : " + scrollY)

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
                    <div key={annotation.id}
                         data-annotation-id={annotation.id}
                         data-annotation-type={attrType}
                         data-annotation-color={annotation.color}
                         className={attrType}>

                        <blockquote dangerouslySetInnerHTML={{__html: html}}
                                    className="border rounded">

                        </blockquote>

                        {/*<div className="annotation-buttons">*/}
                            {/*<a href="#" onClick={() => this.scrollToAnnotation(annotation.id)}>context</a>*/}
                        {/*</div>*/}


                    </div>);

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

