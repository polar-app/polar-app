import React from 'react';
import {AppRuntime, AppRuntimeID} from "polar-shared/src/util/AppRuntime";
import {TwoMigrationDialog} from "./TwoMigrationDialog";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {TwoMigration} from "./TwoMigration";

interface IProps {

    readonly children: React.ReactElement;

    /**
     * Only run under this runtime.
     */
    readonly runtime: AppRuntimeID;

}

export const TwoMigrationForAppRuntime = deepMemo((props: IProps) => {

    const [accepted, setAccepted] = React.useState(false);

    function handleClose() {
        setAccepted(true)
        TwoMigration.markShown();
    }

    if (AppRuntime.get() !== props.runtime) {
        // we NEVER run this on anything else other than this runtime because
        return props.children;
    }

    if (! TwoMigration.shouldShow()) {
        // this has already been shown to the user in the past.
        return props.children;
    }

    if (accepted) {
        return props.children;
    }

    return (
        <TwoMigrationDialog onClose={handleClose}/>
    );

});