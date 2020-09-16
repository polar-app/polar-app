import React from 'react';
import {LoadDocRequest} from "./LoadDocRequest";
import {useDialogManager} from "../../../mui/dialogs/MUIDialogControllers";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export type DocMigrationHandler = (loadDocRequest: LoadDocRequest) => boolean;

export function useDocMigration(): DocMigrationHandler {

    const dialogs = useDialogManager();

    return React.useCallback((loadDocRequest) => {
        const {backendFileRef} = loadDocRequest;

        const fileName = backendFileRef.name;

        if (FilePaths.hasExtension(fileName, "phz")) {

            dialogs.confirm({
                title: "This is a legacy document that needs to be migrated",
                subtitle: "This is a legacy web capture document which must be migrated to our new document as part of 2.0.",
                onAccept: NULL_FUNCTION
            });

            return true;
        } else {
            return false;
        }

    }, [dialogs])

}
