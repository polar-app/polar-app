import {useAnnotationSidebarCallbacks} from "../../../apps/doc/src/AnnotationSidebarStore";
import {MUIPaperToolbar} from "../mui/MUIPaperToolbar";
import {MUISearchBox2} from "../mui/MUISearchBox2";
import {ExportButton} from "../ui/export/ExportButton";
import {LocalStorageFeatureToggle} from "../ui/LocalStorageFeatureToggle";
import * as React from "react";
import {Exporters, ExportFormat} from "../metadata/exporter/Exporters";
import {useDocMetaContext} from "./DocMetaContextProvider";
import {usePersistenceLayerContext} from "../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {useLogger} from "../mui/MUILogger";
import {MUIButtonBar} from "../mui/MUIButtonBar";
import {DeviceRouter} from "../ui/DeviceRouter";

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

                    <DeviceRouter.Desktop>

                        <div className="mt-auto mb-auto">
                            <ExportButton onExport={exportCallback}/>
                        </div>

                    </DeviceRouter.Desktop>

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
