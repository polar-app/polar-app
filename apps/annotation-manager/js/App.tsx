import * as React from 'react';
import {Logger} from '../../../web/js/logger/Logger';
import {Datastore} from '../../../web/js/datastore/Datastore';
import {PersistenceLayer} from '../../../web/js/datastore/PersistenceLayer';
import {Datastores} from '../../../web/js/datastore/Datastores';
import {DocMeta} from '../../../web/js/metadata/DocMeta';
import {Text} from '../../../web/js/metadata/Text';
import {Screenshot} from '../../../web/js/metadata/Screenshot';
import {AnnotationType} from '../../../web/js/metadata/AnnotationType';
import {Elements} from '../../../web/js/util/Elements';

const log = Logger.create();

class App<P> extends React.Component<{}, IAppState> {

    private datastore?: Datastore;
    private persistenceLayer?: PersistenceLayer;

    constructor(props: P, context: any) {
        super(props, context);

        this.state = {
            annotations: [
                // {
                //     text: 'this is just some text2'
                // }
            ]
        };

        (async () => {

            await this.init();

            //this.setState(this.state);

            let fingerprint = '110dd61fd57444010b1ab5ff38782f0f';

            let docMeta = await this.persistenceLayer!.getDocMeta(fingerprint);

            if(docMeta) {
                let annotations = await this.loadDocMeta(docMeta);

                console.log("FIXME: ", annotations);

                this.setState({
                    annotations
                });

            } else {
                log.error("No docMeta");
            }


        })().catch(err => log.error("Could not load disk store: ", err));

    }

    private async init(): Promise<void> {

        let datastore: Datastore;
        let persistenceLayer: PersistenceLayer;

        this.datastore = datastore = Datastores.create();
        this.persistenceLayer = persistenceLayer = new PersistenceLayer(datastore);

        await datastore.init();
        await persistenceLayer.init();

    }

    private async loadDocMeta(docMeta: DocMeta): Promise<IAnnotation[]> {

        let result: IAnnotation[] = [];

        log.info("Loading docMeta...")

        Object.values(docMeta.pageMetas).forEach(pageMeta => {

            Object.values(pageMeta.textHighlights).forEach(textHighlight => {

                console.log("FIXME: ", textHighlight);

                let html: string = "";

                if(typeof textHighlight.text === 'string') {
                    html = `<p>${textHighlight.text}</p>`
                }

                if(textHighlight.text instanceof Text) {

                    if(textHighlight.text.TEXT) {
                        html = `<p>${textHighlight.text.TEXT}</p>`
                    }

                    if(textHighlight.text.HTML) {
                        html = textHighlight.text.HTML;
                    }

                }

                result.push({
                    annotationType: AnnotationType.TEXT_HIGHLIGHT,
                    html
                })

            });

        });

        return result;

    }

    createHTML(annotations: IAnnotation[]) {

        // https://blog.cloudboost.io/for-loops-in-react-render-no-you-didnt-6c9f4aa73778
        //
        // let result = []
        //
        // annotations.map(annotation => {
        //     result.push(<div>hello world</div>);
        // });
        //
        // return result;

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

    render() {
        const { annotations } = this.state;
        return (

            <div id="annotation-manager">

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

export default App;

interface IAppState {

    annotations: IAnnotation[];
}

interface IAnnotation {
    annotationType: AnnotationType,
    html: string
    screenshot?: Screenshot;
}
