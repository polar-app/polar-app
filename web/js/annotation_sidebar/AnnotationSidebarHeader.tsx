import {useAnnotationSidebarCallbacks} from "../../../apps/pdf/src/AnnotationSidebarStore";
import {MUIPaperToolbar} from "../../spectron0/material-ui/MUIPaperToolbar";
import Box from "@material-ui/core/Box";
import {MUISearchBox2} from "../../spectron0/material-ui/MUISearchBox2";
import {ExportButton} from "../ui/export/ExportButton";
import {FeatureToggle} from "../ui/FeatureToggle";
import * as React from "react";
import {Exporters, ExportFormat} from "../metadata/exporter/Exporters";
import {useDocMetaContext} from "./DocMetaContextProvider";
import {usePersistenceLayerContext} from "../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import { Logger } from "polar-shared/src/logger/Logger";

const log = Logger.create();

interface IProps {
}

export const AnnotationHeader = (props: IProps) => {

    const annotationSidebarCallbacks = useAnnotationSidebarCallbacks();
    const exportCallback = useExportCallback();


    // const onTagged = (tags: ReadonlyArray<Tag>) => {
    //     props.doc.docInfo.tags = Tags.toMap(tags);
    // };

    return (

        <MUIPaperToolbar borderBottom>

            <Box p={1}
                 style={{
                     display: 'flex'
                 }}>

                <MUISearchBox2 style={{flexGrow: 1}}
                               className="mt-1 mb-1"
                               onChange={text => annotationSidebarCallbacks.setFilter(text)}
                               placeholder="Filter annotations by text"/>

                <div style={{display: 'flex'}}>

                    {/*FIXME: add this back in!!!*/}
                    <div className="mt-auto mb-auto">
                        <ExportButton onExport={exportCallback}/>
                    </div>

                    <FeatureToggle name='groups'>
                        {/*<GroupSharingButton doc={props.doc}*/}
                        {/*                    datastoreCapabilities={props.datastoreCapabilities}*/}
                        {/*                    onDone={NULL_FUNCTION}/>*/}
                    </FeatureToggle>

                </div>

            </Box>

        </MUIPaperToolbar>

    );

};

function useExportCallback(): (format: ExportFormat) => void {

    const docMetaContext = useDocMetaContext();
    const persistenceLayer = usePersistenceLayerContext();

    const docMeta = docMetaContext.doc?.docMeta!;

    return (format: ExportFormat) => {

        Exporters.doExportFromDocMeta(persistenceLayer.persistenceLayerProvider, format, docMeta)
                 .catch(err => log.error(err));

    }

}
