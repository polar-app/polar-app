import {
    useRepoDocMetaLoader,
    useRepoDocMetaManager
} from "../persistence_layer/PersistenceLayerApp";
import React, {useState} from "react";
import {RepoDocInfo} from "../RepoDocInfo";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../../../web/js/hooks/lifecycle";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {Preconditions} from "polar-shared/src/Preconditions";

export function useRepoDocInfos() {

    const repoDocMetaLoader = useRepoDocMetaLoader();
    const repoDocMetaManager = useRepoDocMetaManager();

    const [state, setState] = useState<ReadonlyArray<RepoDocInfo>>([]);

    const doRefresh = React.useCallback(Debouncers.create(() => {
        setState(repoDocMetaManager.repoDocInfoIndex.values());
    }), []);

    useComponentDidMount(() => {
        doRefresh();
        repoDocMetaLoader.addEventListener(doRefresh)
    });

    useComponentWillUnmount(() => {

        Preconditions.assertCondition(repoDocMetaLoader.removeEventListener(doRefresh),
                                     "Failed to remove event listener");

    });

    return state;

}
