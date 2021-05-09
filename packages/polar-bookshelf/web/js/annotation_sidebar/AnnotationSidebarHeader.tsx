import {useAnnotationSidebarCallbacks} from "../../../apps/doc/src/AnnotationSidebarStore";
import {MUIPaperToolbar} from "../mui/MUIPaperToolbar";
import Box from "@material-ui/core/Box";
import {MUISearchBox2} from "../mui/MUISearchBox2";
import {ExportButton} from "../ui/export/ExportButton";
import {FeatureToggle} from "../ui/FeatureToggle";
import * as React from "react";
import {Exporters, ExportFormat} from "../metadata/exporter/Exporters";
import {useDocMetaContext} from "./DocMetaContextProvider";
import {usePersistenceLayerContext} from "../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import { Logger } from "polar-shared/src/logger/Logger";
import {useLogger} from "../mui/MUILogger";
import {MUIButtonBar} from "../mui/MUIButtonBar";

export const AnnotationHeader = () => {

    const annotationSidebarCallbacks = useAnnotationSidebarCallbacks();
    const exportCallback = useExportCallback();


    // const onTagged = (tags: ReadonlyArray<Tag>) => {
    //     props.doc.docInfo.tags = Tags.toMap(tags);
    // };

    return (

        <MUIPaperToolbar borderBottom>

            <MUIButtonBar className="ml-1 mr-1">

                <MUISearchBox2 style={{flexGrow: 1}}
                               className="mt-1 mb-1"
                               onChange={text => annotationSidebarCallbacks.setFilter(text)}
                               autoComplete="off"
                               placeholder="Filter annotations by text"/>

                <div style={{display: 'flex'}}>

                    <div className="mt-auto mb-auto">
                        <ExportButton onExport={exportCallback}/>
                    </div>

                    <FeatureToggle name='groups'>
                        {/*<GroupSharingButton doc={props.doc}*/}
                        {/*                    datastoreCapabilities={props.datastoreCapabilities}*/}
                        {/*                    onDone={NULL_FUNCTION}/>*/}
                    </FeatureToggle>

                </div>

            </MUIButtonBar>

        </MUIPaperToolbar>

    );

};

function useExportCallback(): (format: ExportFormat) => void {

    const docMetaContext = useDocMetaContext();
    const persistenceLayer = usePersistenceLayerContext();
    const log = useLogger();

    return (format: ExportFormat) => {


        const docMeta = docMetaContext.doc?.docMeta;

        if (docMeta) {
            Exporters.doExportFromDocMeta(persistenceLayer.persistenceLayerProvider, format, docMeta)
                .catch(err => log.error(err));
        }

    }

}
