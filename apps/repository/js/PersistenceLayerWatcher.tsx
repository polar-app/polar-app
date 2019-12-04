import * as React from 'react';
import {ListenablePersistenceLayerProvider, PersistenceLayerProvider} from "../../../web/js/datastore/PersistenceLayer";
import {
    PersistenceLayerManager,
    PersistenceLayerManagerEvent,
    PersistenceLayerManagerEventListener
} from "../../../web/js/datastore/PersistenceLayerManager";
import {ListenablePersistenceLayer} from "../../../web/js/datastore/ListenablePersistenceLayer";

export class PersistenceLayerWatcher extends React.Component<IProps, IState> {

    private eventListener: PersistenceLayerManagerEventListener | undefined;

    private unmounted: boolean = false;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            iter: 0
        };

    }

    public componentDidMount(): void {

        const {persistenceLayerManager} = this.props;

        const onPersistenceLayer = (persistenceLayer: ListenablePersistenceLayer) => {

            this.setState({
                iter: this.state.iter + 1,
                persistenceLayerProvider: () => persistenceLayer
            });

        };

        this.eventListener = (event: PersistenceLayerManagerEvent) => {

            if (this.unmounted) {
                console.warn("We've been unmounted");
            }

            if (event.state === 'changed') {
                onPersistenceLayer(event.persistenceLayer);
            }

        };

        if (persistenceLayerManager.state === 'changed' || persistenceLayerManager.state === 'initialized') {
            onPersistenceLayer(persistenceLayerManager.get());
        }

        persistenceLayerManager.addEventListener(this.eventListener);

        this.unmounted = false;

    }

    public componentWillUnmount(): void {

        if (this.eventListener) {
            this.props.persistenceLayerManager.removeEventListener(this.eventListener);
        }

        this.unmounted = true;

    }

    public render() {

        if (this.state.persistenceLayerProvider) {
            return this.props.render(this.state.persistenceLayerProvider);
        }

        return null;

    }

}

export interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly render: (persistenceLayerProvider: ListenablePersistenceLayerProvider) => React.ReactElement;

}

export interface IState {
    readonly iter: number;
    readonly persistenceLayerProvider?: ListenablePersistenceLayerProvider;
}

