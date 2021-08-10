import * as React from 'react';
import Button from "@material-ui/core/Button";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {JSONRPC} from "../../../../web/js/datastore/sharing/rpc/JSONRPC";

export const ExportDataButton = React.memo(function ExportDataButton() {

    const dialogManager = useDialogManager()

    const onExport = React.useCallback(() => {

        JSONRPC.exec("CreateSnapshotFunction", {})
            .catch(err => console.error("Could not create snapshot: ", err));

    }, []);

    const handleClick = React.useCallback(() => {

        dialogManager.confirm({
            title: "Export Data",
            subtitle: "This will export your data and send you an archive via email.  Do you wish to continue?",
            onAccept: () => onExport()
        })

    }, [dialogManager, onExport]);

    return (
        <Button variant="contained"
                onClick={handleClick}>
            Export Data
        </Button>
    );
});
