import * as React from 'react';
import {LocalPrefs} from "../../../../../web/js/util/LocalPrefs";
import { TwoMigrationForAppRuntime } from './TwoMigrationForAppRuntime';

const KEY = 'two-migration';

function useMigration(): [boolean, () => Promise<void>] {

    const doMigration = ! LocalPrefs.isMarked(KEY);
    const onClose = async () => {
        LocalPrefs.mark(KEY);
    }

    return [doMigration, onClose];

}

interface IProps {
    readonly children: React.ReactElement;
}

export const TwoMigrationForElectron = React.memo(function TwoMigrationForElectron(props: IProps) {

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

TwoMigrationForElectron.displayName='TwoMigrationForElectron';
