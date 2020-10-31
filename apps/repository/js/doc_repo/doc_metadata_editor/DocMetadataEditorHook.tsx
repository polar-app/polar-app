import * as React from 'react';
import {useDialogManager} from "../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {DocMetadataEditor} from "./DocMetadataEditor";

export function useDocMetadataEditor() {

    const dialogs = useDialogManager();

    const docInfoRef = React.useRef<IDocInfo | undefined>();

    const handleUpdate = React.useCallback((docInfo: IDocInfo) => {
        docInfoRef.current = docInfo
    }, []);

    return React.useCallback((docInfo: IDocInfo,
                              onUpdate: (docInfo: IDocInfo) => void) => {

        docInfoRef.current = docInfo;

        dialogs.dialog({
            title: "Update Document Metadata",
            body: (
                <>
                    {docInfo && (
                        <DocMetadataEditor docInfo={docInfo} onUpdate={handleUpdate}/>
                    )}
                </>
            ),
            type: 'none',
            onAccept: () => onUpdate(docInfoRef.current!),
            acceptText: "Update",
            maxWidth: "lg"
        });

    }, [dialogs, handleUpdate])

}