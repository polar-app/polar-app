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
            <div>
                TODO
            </div>
        </AdaptiveDialog>
    )
});
