import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import React from "react";
import {AdaptiveDialog} from "../../mui/AdaptiveDialog";
import {useMigrationSnapshotByName} from "./UseMigrationSnapshot";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

interface IProps {
    readonly children: JSX.Element;
}

function useMigrationExecutor() {

    return React.useCallback(() => {

        const cpk = Hashcodes.createRandomID();

        console.log("Starting migration using cloud progress key: " + cpk);

    }, []);
}

export const MigrationToBlockAnnotations = React.memo((props: IProps) => {

    const [migrationSnapshot, error] = useMigrationSnapshotByName('block-annotations');
    const migrationExecutor = useMigrationExecutor();

    React.useEffect(() => {

        if (migrationSnapshot?.empty) {
            migrationExecutor();
        }

    }, [migrationSnapshot, migrationExecutor]);

    if (migrationSnapshot && migrationSnapshot.docs[0].status === 'completed') {
        return props.children;
    }

    if (error) {
        return (
            <Alert severity="error">
                We're unable to migrate your data: <q>{error.message}</q>
            </Alert>
        );
    }

    // TODO: how do we START the migration...We have to trigger the cloud function on the backend.

    // TODO: need to read the cloud progress listener... and the key that's used.

    // TODO start doing the migration now...

    // TODO: new users need to be pre-migrated and we have to write a record for
    // them in the migration table.

    return (
        <AdaptiveDialog>
            <>
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
                            some really cool new features.
                        </Typography>
                    </Box>
                </div>
            </>
        </AdaptiveDialog>
    )
});
