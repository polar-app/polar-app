import React from 'react';
import {AppRuntime, AppRuntimeID} from "polar-shared/src/util/AppRuntime";
import {TwoMigrationDialog} from "./TwoMigrationDialog";
import {useLogger} from "../../../../../web/js/mui/MUILogger";

interface IProps {

    readonly children: React.ReactElement;

    /**
     * Only run under this runtime.
     */
    readonly runtime: AppRuntimeID;

    readonly onClose: () => Promise<void>;

}

export type MigrationMarkerCallback = () => Promise<void>;

export type MigrationHookResult = [boolean | undefined, MigrationMarkerCallback];

export const TwoMigrationForAppRuntime = React.memo(function TwoMigrationForAppRuntime(props: IProps) {

    const [accepted, setAccepted] = React.useState(false);
    const log = useLogger();

    const handleClose = React.useCallback(() => {

        async function doAsync() {
            await props.onClose();
            setAccepted(true);
        }

        doAsync()
            .catch(err => log.error(err));

    }, [log, props]);

    if (AppRuntime.get() !== props.runtime) {
        // we NEVER run this on anything else other than this runtime because
        return props.children;
    }

    if (accepted) {
        return props.children;
    }

    return (
        <TwoMigrationDialog onClose={handleClose}/>
    );

});

TwoMigrationForAppRuntime.displayName='TwoMigrationForAppRuntime';
