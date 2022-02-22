import {ViewerURLs} from "../ViewerURLs";
import {useDocURLLoader} from './DocURLLoader';
import {usePersistenceLayerContext} from "../../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {useDocMigration} from "../DocMigration";
import React from 'react';
import {usePremiumFeatureCallback1} from "../../../../../../apps/repository/js/ui/usePremiumFeatureCallback";
import {useFeatureEnabled} from "../../../../features/FeaturesRegistry";

export function useBrowserDocLoader() {

    const {persistenceLayerProvider} = usePersistenceLayerContext()
    const docURLLoader = useDocURLLoader();
    const docMigration = useDocMigration();

    const premiumDocViewer = useFeatureEnabled('premium-doc-viewer');

    const loaderPremium = React.useCallback((loadDocRequest) => {

        if (! docMigration(loadDocRequest)) {
            const viewerURL = ViewerURLs.create(persistenceLayerProvider, loadDocRequest);
            docURLLoader(viewerURL.url);
        }

    }, [docMigration, docURLLoader, persistenceLayerProvider]);

    const premiumFeatureCallback = usePremiumFeatureCallback1('doc-viewer', loaderPremium);

    return premiumDocViewer ? premiumFeatureCallback : loaderPremium;

}
