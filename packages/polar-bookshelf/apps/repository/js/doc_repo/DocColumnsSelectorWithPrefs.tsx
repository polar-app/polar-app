import * as React from 'react';
import {useDocRepoColumnsPrefs, useDocRepoColumnsPrefsMutator} from "./DocRepoColumnsPrefsHook";
import {DocColumnsSelector} from "./DocColumnsSelector";

export const DocColumnsSelectorWithPrefs = () => {

    const columns = useDocRepoColumnsPrefs();
    const mutator = useDocRepoColumnsPrefsMutator();

    return (
        <DocColumnsSelector columns={columns} onAccept={mutator}/>
    )

}