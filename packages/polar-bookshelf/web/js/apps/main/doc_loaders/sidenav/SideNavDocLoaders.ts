import {usePersistenceLayerContext} from "../../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {useDocMigration} from "../DocMigration";
import React from "react";
import {ViewerURLs} from "../ViewerURLs";
import {useSideNavCallbacks} from "../../../../sidenav/SideNavStore";

export function useSideNavDocLoader() {

    const {persistenceLayerProvider} = usePersistenceLayerContext()
    const docMigration = useDocMigration();
    const {addTab} = useSideNavCallbacks();

    return React.useCallback((loadDocRequest) => {

        if (! docMigration(loadDocRequest)) {

            const viewerURL = ViewerURLs.create(persistenceLayerProvider, loadDocRequest);

            const url = viewerURL.replace("http://localhost:8050", "");

            addTab({
                url,
                title: loadDocRequest.title,
            })

        }

    }, [addTab, docMigration, persistenceLayerProvider]);

}
