import * as React from 'react';
import {ListenablePersistenceLayerProvider, PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {
    PersistenceLayerManager,
    PersistenceLayerManagerEvent,
} from "../../../../web/js/datastore/PersistenceLayerManager";
import {ListenablePersistenceLayer} from "../../../../web/js/datastore/ListenablePersistenceLayer";
import {useComponentDidMount, useComponentWillUnmount} from "../../../../web/js/hooks/ReactLifecycleHooks";

export interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly Component: React.FunctionComponent<{persistenceLayerProvider: ListenablePersistenceLayerProvider}>;
}

export interface IState {
    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider | undefined;
}


export const PersistenceLayerWatcher = React.memo(function PersistenceLayerWatcher(props: IProps) {

    const unmountedRef = React.useRef(false);
    const [state, setState] = React.useState<IState>({persistenceLayerProvider: undefined});

    const onPersistenceLayer = React.useCallback((persistenceLayer: ListenablePersistenceLayer) => {

        setState({
            persistenceLayerProvider: () => persistenceLayer
        });

    }, []);

    const eventListener = React.useCallback((event: PersistenceLayerManagerEvent) => {

        if (unmountedRef.current) {
            console.warn("We've been unmounted");
        }

        if (event.state === 'changed') {
            onPersistenceLayer(event.persistenceLayer);
        }

    }, [onPersistenceLayer]);

    useComponentDidMount(() => {

        const {persistenceLayerManager} = props;

        if (persistenceLayerManager.state === 'changed' || persistenceLayerManager.state === 'initialized') {
            onPersistenceLayer(persistenceLayerManager.get());
        }

        persistenceLayerManager.addEventListener(eventListener);

        unmountedRef.current = false;
    })

    useComponentWillUnmount(() => {

        props.persistenceLayerManager.removeEventListener(eventListener);

        unmountedRef.current = true;

    });


    if (state.persistenceLayerProvider) {
        return props.Component({persistenceLayerProvider: state.persistenceLayerProvider});
    }

    return (
        <div className="NoPersistenceLayer">

        </div>
    );

});
