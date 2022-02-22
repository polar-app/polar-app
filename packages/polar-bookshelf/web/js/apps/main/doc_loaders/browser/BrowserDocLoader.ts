import {LoadDocRequest} from '../LoadDocRequest';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {PersistenceLayerProvider} from '../../../../datastore/PersistenceLayer';
import {IDocLoader, IDocLoadRequest} from '../IDocLoader';
import {ViewerURLs} from "../ViewerURLs";
import {DocURLLoader, useDocURLLoader} from './DocURLLoader';
import {usePersistenceLayerContext} from "../../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {useDocMigration} from "../DocMigration";
import React from 'react';
import {usePremiumFeatureCallback1} from "../../../../../../apps/repository/js/ui/usePremiumFeatureCallback";
import {useFeatureEnabled} from "../../../../features/FeaturesRegistry";

export class BrowserDocLoader implements IDocLoader {

    constructor(private readonly persistenceLayerProvider: PersistenceLayerProvider) {
        this.persistenceLayerProvider = persistenceLayerProvider;
    }

    public create(loadDocRequest: LoadDocRequest): IDocLoadRequest {

        const viewerURL = ViewerURLs.create(this.persistenceLayerProvider, loadDocRequest);

        const linkLoader = DocURLLoader.create();

        Preconditions.assertPresent(loadDocRequest.fingerprint, "fingerprint");
        Preconditions.assertPresent(loadDocRequest.backendFileRef, "backendFileRef");
        Preconditions.assertPresent(loadDocRequest.backendFileRef.name, "backendFileRef.name");

        return {

            async load(): Promise<void> {
                console.log("Loading URL: ", viewerURL);
                linkLoader(viewerURL.url);
            }

        };

    }

}

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
