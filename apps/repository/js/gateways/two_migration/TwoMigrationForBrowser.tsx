import * as React from 'react';
import {usePrefs} from "../../persistence_layer/PrefsHook";
import {LocalPrefs} from "../../../../../web/js/util/LocalPrefs";
import { TwoMigrationForAppRuntime, MigrationHookResult } from './TwoMigrationForAppRuntime';

const KEY = 'two-migration';

function useMigration(): MigrationHookResult {

    const prefs = usePrefs();
    const persistentPrefs = prefs.value;

    if (persistentPrefs) {

        const doMigration = ! (persistentPrefs.isMarked(KEY) || LocalPrefs.isMarked(KEY));

        const onClose = async () => {
            LocalPrefs.mark(KEY);
            persistentPrefs.mark(KEY);
            await persistentPrefs.commit();
        }

        return [doMigration, onClose];

    }

    if (prefs.error) {
        console.error("Could not useMigration: ", prefs.error);
        throw prefs.error;
    }

    const onClose = async () => {
        throw new Error("Not ready")
    }

    return [undefined, onClose];

}

interface IProps {
    readonly children: React.ReactElement;
}

export const TwoMigrationForBrowser = React.memo((props: IProps) => {

    const [doMigration, onClose] = useMigration();

    if (doMigration === undefined) {
        return null;
    }

    if (! doMigration) {
        return props.children;
    }

    return (
        <TwoMigrationForAppRuntime runtime="browser" onClose={onClose}>
            {props.children}
        </TwoMigrationForAppRuntime>
    );

});