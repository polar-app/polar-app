import * as React from 'react';
import {usePrefs} from "../../persistence_layer/PrefsHook";
import {LocalPrefs} from "../../../../../web/js/util/LocalPrefs";
import { TwoMigrationForAppRuntime } from './TwoMigrationForAppRuntime';

const KEY = 'two-migration';

function useMigration(): [boolean, () => Promise<void>] {

    const prefs = usePrefs();
    const persistentPrefs = prefs.value;

    if (persistentPrefs) {

        const marked = persistentPrefs.isMarked(KEY) || LocalPrefs.isMarked(KEY);
        const doMarked = async () => {
            LocalPrefs.mark(KEY);
            persistentPrefs.mark(KEY);
            await persistentPrefs.commit();
        }

        return [marked, doMarked];

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