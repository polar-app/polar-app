import * as React from 'react';
import {LocalPrefs} from "../../../../../web/js/util/LocalPrefs";
import { TwoMigrationForAppRuntime } from './TwoMigrationForAppRuntime';

const KEY = 'two-migration';

function useMigration(): [boolean, () => Promise<void>] {

    const marked = LocalPrefs.isMarked(KEY);
    const doMarked = async () => {
        LocalPrefs.mark(KEY);
    }

    return [marked, doMarked];

}

interface IProps {
    readonly children: React.ReactElement;
}

export const TwoMigrationForElectron = React.memo((props: IProps) => {

    const [doMigration, onClose] = useMigration();

    if (! doMigration) {
        return props.children;
    }

    return (
        <TwoMigrationForAppRuntime runtime="electron" onClose={onClose}>
            {props.children}
        </TwoMigrationForAppRuntime>
    );

});