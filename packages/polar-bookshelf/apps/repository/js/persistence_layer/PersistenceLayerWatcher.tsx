import * as React from 'react';
import {PersistenceLayer, PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {
    PersistenceLayerManager,
    PersistenceLayerManagerEvent,
} from "../../../../web/js/datastore/PersistenceLayerManager";
import {useComponentDidMount, useComponentWillUnmount} from "../../../../web/js/hooks/ReactLifecycleHooks";

export interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly Component: React.FunctionComponent<{persistenceLayerProvider: PersistenceLayerProvider}>;
}

export interface IState {
    readonly persistenceLayerProvider: PersistenceLayerProvider | undefined;
}


export const PersistenceLayerWatcher = React.memo(function PersistenceLayerWatcher(props: IProps) {

    const unmountedRef = React.useRef(false);
    const [state, setState] = React.useState<IState>({persistenceLayerProvider: undefined});

    const onPersistenceLayer = React.useCallback((persistenceLayer: PersistenceLayer) => {

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
