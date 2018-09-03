import * as React from 'react';
import {Logger} from '../../../web/js/logger/Logger';
import {Datastore} from '../../../web/js/datastore/Datastore';
import {PersistenceLayer} from '../../../web/js/datastore/PersistenceLayer';
import {Datastores} from '../../../web/js/datastore/Datastores';
import {DocMeta} from '../../../web/js/metadata/DocMeta';
import {Screenshot} from '../../../web/js/metadata/Screenshot';

const log = Logger.create();

class App<P> extends React.Component<{}, IAppState> {

    private datastore?: Datastore;
    private persistenceLayer?: PersistenceLayer;

    constructor(props: P, context: any) {
        super(props, context);

        this.state = {
            annotations: [
                {
                    text: 'this is just some text'
                },
                {
                    text: 'this is just some text2'
                }
            ]
        };

        (async () => {

            await this.init();

            //this.setState(this.state);

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

    private async loadDocMeta(docMeta: DocMeta) {

    }

    render() {
        const { annotations } = this.state;
        return (

            <div id="annotation-manager">

                {annotations.map((annotation, idx) =>
                    <div className="annotation">
                        <div>this is an annotation: {annotation.text}</div>
                    </div>
                )}

            </div>

        );
    }
}

export default App;

interface IAppState {


    annotations: IAnnotation[];
}

interface IAnnotation {
    text: string
    screenshot?: Screenshot;
}
