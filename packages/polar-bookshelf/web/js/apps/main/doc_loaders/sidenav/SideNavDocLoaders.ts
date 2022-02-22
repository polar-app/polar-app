import {usePersistenceLayerContext} from "../../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {useDocMigration} from "../DocMigration";
import React from "react";
import {ViewerURLs} from "../ViewerURLs";
import {TabContentType, useSideNavCallbacks} from "../../../../sidenav/SideNavStore";
import {LoadDocRequest} from "../LoadDocRequest";
import {useFeatureEnabled} from "../../../../features/FeaturesRegistry";
import {usePremiumFeatureCallback1} from "../../../../../../apps/repository/js/ui/usePremiumFeatureCallback";

function computeTabContentType(loadDocRequest: LoadDocRequest): TabContentType {

    const name = loadDocRequest.backendFileRef.name.toLowerCase();

    if (name.endsWith('.pdf')) {
        return 'pdf';
    }

    if (name.endsWith('.epub')) {
        return 'epub';
    }

    throw new Error("Unable to determine content type: " + name);

}

export function useSideNavDocLoader() {

    const {persistenceLayerProvider} = usePersistenceLayerContext()
    const docMigration = useDocMigration();
    const {addTab} = useSideNavCallbacks();
    const premiumDocViewer = useFeatureEnabled('premium-doc-viewer');

    const sideNavDocLoaderPremium = React.useCallback((loadDocRequest: LoadDocRequest) => {

        if (! docMigration(loadDocRequest)) {

            const type = computeTabContentType(loadDocRequest);

            const viewerURL = ViewerURLs.create(persistenceLayerProvider, loadDocRequest);

            function computeToRelativeURL(url: string | undefined): string | undefined {

                if (url === undefined) {
                    return undefined;
                }

                return url.replace(/^(http|https):\/\/[^/]+/g, "");

            }

            addTab({
                id: loadDocRequest.fingerprint,
                url: computeToRelativeURL(viewerURL.url)!,
                title: loadDocRequest.title,
                type,
                initialUrl: computeToRelativeURL(viewerURL.initialUrl || loadDocRequest.initialUrl),
            })

        }

    }, [addTab, docMigration, persistenceLayerProvider]);

    const sideNavDocLoader = usePremiumFeatureCallback1('doc-viewer', sideNavDocLoaderPremium);

    return premiumDocViewer ? sideNavDocLoader : sideNavDocLoaderPremium;

}
