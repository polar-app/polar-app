import * as React from 'react';
import {Logger} from '../logger/Logger';
import {Datastore} from '../datastore/Datastore';
import {DefaultPersistenceLayer} from '../datastore/DefaultPersistenceLayer';
import {DocMeta} from '../metadata/DocMeta';
import {PageMeta} from '../metadata/PageMeta';
import {AnnotationType} from '../metadata/AnnotationType';
import {BaseHighlight} from '../metadata/BaseHighlight';
import {Screenshot} from '../metadata/Screenshot';
import {Screenshots} from '../metadata/Screenshots';
import {Optional} from '../util/ts/Optional';
import {Text} from '../metadata/Text';

const log = Logger.create();

export class AnnotationSidebar extends React.Component<AnnotationSidebarProps, IAppState> {

    constructor(props: AnnotationSidebarProps, context: any) {
        super(props, context);

        this.state = {
            annotations: [
                // {
                //     text: 'this is just some text2'
                // }
            ]
        };

        (async () => {

            const annotations = await this.loadDocMeta(props.docMeta);

            this.setState({
                annotations
            });


        })().catch(err => log.error("Could not load disk store: ", err));

    }

    private async loadDocMeta(docMeta: DocMeta): Promise<IAnnotation[]> {

        const result: IAnnotation[] = [];

        log.info("Loading docMeta...");

        Object.values(docMeta.pageMetas).forEach(pageMeta => {
            result.push(...this.getTextHighlights(pageMeta));
            result.push(...this.getAreaHighlights(pageMeta));
        });

        return result;

    }

    private getTextHighlights(pageMeta: PageMeta): IAnnotation[] {

        const result: IAnnotation[] = [];

        log.info("Loading docMeta...");

        Object.values(pageMeta.textHighlights).forEach(textHighlight => {

            let html: string = "";

            if (typeof textHighlight.text === 'string') {
                html = `<p>${textHighlight.text}</p>`;
            }

            if (textHighlight.text instanceof Text) {

                if (textHighlight.text.TEXT) {
                    html = `<p>${textHighlight.text.TEXT}</p>`
                }

                if (textHighlight.text.HTML) {
                    html = textHighlight.text.HTML;
                }

            }

            const screenshot = this.getScreenshot(pageMeta, textHighlight);

            result.push({
                id: textHighlight.id,
                annotationType: AnnotationType.TEXT_HIGHLIGHT,
                screenshot,
                html
            });

        });

        return result;

    }

    getAreaHighlights(pageMeta: PageMeta): IAnnotation[] {

        let result: IAnnotation[] = [];

        log.info("Loading docMeta...");

        Object.values(pageMeta.areaHighlights).forEach(areaHighlight => {

            console.log('FIXME: areaHighlight', areaHighlight)

            const screenshot = this.getScreenshot(pageMeta, areaHighlight);

            result.push({
                id: areaHighlight.id,
                annotationType: AnnotationType.AREA_HIGHLIGHT,
                screenshot,
                html: undefined
            });

        });

        return result;

    }


    getScreenshot(pageMeta: PageMeta, highlight: BaseHighlight): Screenshot | undefined {

        let screenshot: Screenshot | undefined;

        Object.values(highlight.images).forEach( image => {

            if(image.rel && image.rel === 'screenshot') {

                const screenshotURI = Screenshots.parseURI(image.src);

                if(screenshotURI) {
                    screenshot = pageMeta.screenshots[screenshotURI.id];
                }

            }

        });

        return screenshot;

    }

    createHTML(annotations: IAnnotation[]) {

        // https://blog.cloudboost.io/for-loops-in-react-render-no-you-didnt-6c9f4aa73778
        //
        const result: any = [];

        annotations.map(annotation => {
            // result.push(React.createElement( 'div', [], Elements.createElementHTML(annotation.html)));

            const html = Optional.of(annotation.html).getOrElse('');

            if (annotation.annotationType === AnnotationType.AREA_HIGHLIGHT) {

                if (annotation.screenshot) {
                    result.push(
                        <div key={annotation.id} className='area-highlight'>
                            <img src={annotation.screenshot.src}/>
                        </div>);
                }

            } else {

                if (annotation.screenshot) {
                    result.push(
                        <div key={`screenshot:${annotation.id}`} className='area-highlight'>
                            <img src={annotation.screenshot.src}/>
                        </div>);
                }

                result.push(<div key={annotation.id} className='text-highlight' dangerouslySetInnerHTML={{__html: html}}></div>);
            }

        });

        return result;

        {/*{annotations.map((annotation, idx) =>*/}
        {/*<div className="annotation">*/}
        {/*{Elements.createElementHTML(annotation.html)}*/}
        {/*</div>*/}
        {/*)}*/}


        // // Outer loop to create parent
        // for (let i = 0; i < 3; i++) {
        //     let children = []
        //     //Inner loop to create children
        //     for (let j = 0; j < 5; j++) {
        //         children.push(<td>{`Column ${j + 1}`}</td>)
        //     }
        //     //Create the parent and add the children
        //     result.push(<tr>{children}</tr>)
        // }
        // return result

    }

    public render() {
        const { annotations } = this.state;
        return (

            <div id="annotation-manager">

                {this.createHTML(annotations)}
                {/*{annotations.map((annotation, idx) =>*/}
                {/*<div className="annotation">*/}
                {/*{Elements.createElementHTML(annotation.html)}*/}
                {/*</div>*/}
                {/*)}*/}

                {/*{annotations.map((annotation, idx) => Elements.createElementHTML(annotation.html))}*/}

            </div>

        );
    }
}

interface IAppState {

    annotations: IAnnotation[];
}

interface IAnnotation {
    id: string;
    annotationType: AnnotationType;
    html?: string;
    screenshot?: Screenshot;
}

interface AnnotationSidebarProps {
    readonly docMeta: DocMeta;
}
