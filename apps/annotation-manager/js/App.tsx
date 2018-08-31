import * as React from 'react';
import {Logger} from '../../../web/js/logger/Logger';

const log = Logger.create();

class App<P> extends React.Component<{}, IAppState> {

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

            //this.setState(this.state);

        })().catch(err => log.error("Could not load disk store: ", err));

    }

    private async init(): Promise<void> {

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
}
