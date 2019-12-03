import * as React from 'react';
import {PersistenceLayerProvider} from "../../../web/js/datastore/PersistenceLayer";
import {
    PersistenceLayerManager,
    PersistenceLayerManagerEvent,
    PersistenceLayerManagerEventListener
} from "../../../web/js/datastore/PersistenceLayerManager";
import {ListenablePersistenceLayer} from "../../../web/js/datastore/ListenablePersistenceLayer";

export class PersistenceLayerWatcher extends React.Component<IProps, IState> {

    private eventListener: PersistenceLayerManagerEventListener;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

        const {persistenceLayerManager} = this.props;

        const onPersistenceLayer = (persistenceLayer: ListenablePersistenceLayer) => {
            this.setState({
                persistenceLayerProvider: () => persistenceLayer
            });
        };

        this.eventListener = (event: PersistenceLayerManagerEvent) => {

            if (event.state === 'changed') {
                onPersistenceLayer(event.persistenceLayer);
            }

        };

        persistenceLayerManager.addEventListener(this.eventListener);

    }


    public componentWillUnmount(): void {

        if (this.eventListener) {
            this.props.persistenceLayerManager.removeEventListener(this.eventListener);
        }

    }

    public render() {

        if (this.state.persistenceLayerProvider) {
            this.props.render(this.state.persistenceLayerProvider);
        }

        return null;

    }

}

export interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly render: (persistenceLayerProvider: PersistenceLayerProvider) => React.ReactElement;

}

export interface IState {
    readonly persistenceLayerProvider?: PersistenceLayerProvider;
}

