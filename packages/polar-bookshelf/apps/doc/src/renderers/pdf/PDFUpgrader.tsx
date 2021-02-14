import * as React from 'react';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {Arrays} from "polar-shared/src/util/Arrays";
import {PDFMetadata} from "polar-pdf/src/pdf/PDFMetadata";
import {usePersistenceLayerContext} from "../../../../repository/js/persistence_layer/PersistenceLayerApp";
import {DocMetaFileRefs} from "../../../../../web/js/datastore/DocMetaRef";
import {Backend} from "polar-shared/src/datastore/Backend";
import { useDocViewerCallbacks } from '../../DocViewerStore';
import {DocMetas} from "../../../../../web/js/metadata/DocMetas";

function usePDFUpgraderForPageInfoDimensions() {

    const {persistenceLayerProvider} = usePersistenceLayerContext();
    const {updateDocMeta} = useDocViewerCallbacks();

    return React.useCallback(async (docMeta: IDocMeta) => {

        function requiresUpgrade() {

            const pageInfo = Arrays.first(Object.values(docMeta.pageMetas))?.pageInfo;

            return pageInfo?.dimensions === undefined;
        }

        async function upgrade() {

            const persistenceLayer = persistenceLayerProvider();

            const docMetaFileRef = DocMetaFileRefs.createFromDocMeta(docMeta);

            if (docMetaFileRef.docFile) {

                const docFile = persistenceLayer.getFile(Backend.STASH, docMetaFileRef.docFile);

                const metadata = await PDFMetadata.getMetadata(docFile.url);

                function updateDimensions() {

                    for(let pageNum = 1; pageNum <= docMeta.docInfo.nrPages; ++pageNum) {
                        const pdfDimensions = metadata.pageInfoIndex[pageNum].dimensions;
                        DocMetas.getPageMeta(docMeta, pageNum).pageInfo.dimensions = pdfDimensions;
                    }

                }

                updateDimensions();
                updateDocMeta(docMeta);

            }

        }

        const doUpgrade = requiresUpgrade();

        if (doUpgrade) {
            await upgrade();
        }

    }, [persistenceLayerProvider, updateDocMeta])

}

export function usePDFUpgrader() {

    const upgradeDimensions = usePDFUpgraderForPageInfoDimensions();
    return React.useCallback(async (docMeta: IDocMeta) => {
        await upgradeDimensions(docMeta);
    }, [upgradeDimensions])

}