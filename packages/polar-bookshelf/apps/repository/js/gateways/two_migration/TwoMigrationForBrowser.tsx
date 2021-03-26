import * as React from 'react';
import {LocalPrefs} from "../../../../../web/js/util/LocalPrefs";
import { TwoMigrationForAppRuntime, MigrationHookResult } from './TwoMigrationForAppRuntime';
import {usePrefsContext} from "../../persistence_layer/PrefsContext2";

const KEY = 'two-migration';

function useMigration(): MigrationHookResult {

    const prefs = usePrefsContext();

    const doMigration = ! (prefs.isMarked(KEY) || LocalPrefs.isMarked(KEY));

    const onClose = async () => {
        LocalPrefs.mark(KEY);
        prefs.mark(KEY);
        await prefs.commit();
    }

    return [doMigration, onClose];

}

interface IProps {
    readonly children: React.ReactElement;
}

export const TwoMigrationForBrowser = React.memo(function TwoMigrationForBrowser(props: IProps) {

    const [doMigration, onClose] = useMigration();

    if (doMigration === undefined) {
        return (
            <div className="TwoMigrationForBrowserNoMigration"/>
        );
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
