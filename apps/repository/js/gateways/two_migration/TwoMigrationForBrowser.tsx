import * as React from 'react';
import {usePrefs} from "../../persistence_layer/PrefsHook";
import {LocalPrefs} from "../../../../../web/js/util/LocalPrefs";
import { TwoMigrationForAppRuntime } from './TwoMigrationForAppRuntime';

const KEY = 'two-migration';

function useMigration(): [boolean, () => Promise<void>] {

    const prefs = usePrefs();
    const persistentPrefs = prefs.value;

    if (persistentPrefs) {

        const doMigration = ! persistentPrefs.isMarked(KEY) || ! LocalPrefs.isMarked(KEY);
        const onClose = async () => {
            LocalPrefs.mark(KEY);
            persistentPrefs.mark(KEY);
            await persistentPrefs.commit();
        }

        return [doMigration, onClose];

    }

    throw prefs.error;

}

interface IProps {
    readonly children: React.ReactElement;
}

export const TwoMigrationForBrowser = React.memo((props: IProps) => {

    const [doMigration, onClose] = useMigration();

    if (! doMigration) {
        return props.children;
    }

    return (
        <TwoMigrationForAppRuntime runtime="browser" onClose={onClose}>
            {props.children}
        </TwoMigrationForAppRuntime>
    );

});