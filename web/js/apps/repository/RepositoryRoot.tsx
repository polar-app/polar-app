import React from 'react';
import {TwoMigrationForElectron} from "../../../../apps/repository/js/gateways/two_migration/TwoMigrationForElectron";

interface IProps {
    readonly children: React.ReactElement;
}

/**
 * Root components that are specific just to the Repository.
 */
export const RepositoryRoot = React.memo((props: IProps) =>     {
    return (
        <TwoMigrationForElectron>
            {props.children}
        </TwoMigrationForElectron>
    );

});

RepositoryRoot.displayName='RepositoryRoot';