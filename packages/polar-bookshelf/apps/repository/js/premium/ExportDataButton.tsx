import * as React from 'react';
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {JSONRPC} from "../../../../web/js/datastore/sharing/rpc/JSONRPC";
import GetAppIcon from '@material-ui/icons/GetApp';
import {FullWidthButton} from '../configure/settings/FullWidthButton';

export const ExportDataButton = React.memo(function ExportDataButton() {

    const dialogManager = useDialogManager()

    const onExport = React.useCallback(() => {

        async function doAsync() {

            await JSONRPC.exec("CreateSnapshotFunction", {});

            dialogManager.snackbar({
                type: 'success',
                message: 'Data is being exported. Check your email in a few minutes for your download link.'
            });

        }

        doAsync()
            .catch(err => console.error("Could not create snapshot: ", err));

    }, [dialogManager]);

    const handleClick = React.useCallback(() => {

        dialogManager.confirm({
            title: "Export Data",
            subtitle: "This will export your data and send you an archive via email.  Do you wish to continue?",
            type: 'info',
            onAccept: () => onExport()
        })

    }, [dialogManager, onExport]);

    return (
        <FullWidthButton onClick={handleClick} icon={<GetAppIcon />}>
            Export Data
        </FullWidthButton>
    );
});
