import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {AdaptiveDialog} from "../../mui/AdaptiveDialog";
import {useMigrationSnapshotByName} from "./UseMigrationSnapshot";

interface IProps {
    readonly children: JSX.Element;
}

export const MigrationToBlockAnnotations = React.memo((props: IProps) => {

    const [migration, error] = useMigrationSnapshotByName('block-annotations');

    if (migration?.status === 'completed') {
        return props.children;
    }

    // TODO: handle the error now...

    // TODO: how do we START the migration...We have to trigger the cloud function on the backend.

    // TODO: need to write the cloud progress listener... and the key that's used.

    // TODO start doing the migration now...

    return (
        <AdaptiveDialog>

            <div style={{
                     display: 'flex',
                     justifyContent: 'center'
                 }}>

                <Box m={1}>
                    <Typography variant="h2">
                        We're migrating your data!
                    </Typography>
                </Box>

                <Box m={1}>

                    <Typography variant="h4">
                        Just a moment please.  We're migrating your data to enable
                        some really cool new features.  We're also going to create a
                        backup just in case.
                    </Typography>

                </Box>

            </div>
        </AdaptiveDialog>
    )
});
