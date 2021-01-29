import * as React from 'react';
import {useDocRepoStore} from "../../../../../apps/repository/js/doc_repo/DocRepoStore2";
import {Reducers} from "polar-shared/src/util/Reducers";
import {useUserInfoContext} from "../auth_handler/UserInfoProvider";
import {Plans} from "polar-accounts/src/Plans";
import {AccountUpgrades} from "../../../accounts/AccountUpgrades";
import computeStorageForPlan = AccountUpgrades.computeStorageForPlan;
import {Percentage100, Percentages} from "polar-shared/src/util/Percentages";
import {
    usePersistenceLayerContext,
    useRepoDocMetaManager
} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {DocMetaSnapshotError, DocMetaSnapshotEvent} from "../../../datastore/Datastore";
import {SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";

export type Bytes = number;

interface IAccounting {
    readonly storageInBytes: Bytes;
    readonly nrWebCaptures: number;
}

/**
 * Simple accounting function to keep track of storage.
 */
export function useAccounting0(): IAccounting {

    const repoDocMetaManager = useRepoDocMetaManager();

    const data = repoDocMetaManager.repoDocInfoIndex.values();

    const storageInBytes = data.map(current => current.docInfo.bytes || 0)
                               .reduce(Reducers.SUM, 0)

    const nrWebCaptures = data.filter(current => current.docInfo.webCapture)
                              .length;

    return {storageInBytes, nrWebCaptures};

}

/**
 * Simple accounting function to keep track of storage.
 */
export function useAccounting(): IAccounting {

    const {persistenceLayerProvider} = usePersistenceLayerContext();
    const [state, setState] = React.useState<IAccounting>({storageInBytes: 0, nrWebCaptures: 0});
    const persistenceLayer = persistenceLayerProvider();

    type DocMetaIndex = {[id: string]: IDocInfo};

    const docMetaIndex = React.useMemo<DocMetaIndex>(() => {
        return {};
    }, [])

    const rebuildState = React.useCallback(() => {

        const data = Object.values(docMetaIndex);

        const storageInBytes = data.map(current => current.bytes || 0)
            .reduce(Reducers.SUM, 0)

        const nrWebCaptures = data.filter(current => current.webCapture)
            .length;

        const newState = {storageInBytes, nrWebCaptures};

        setState(newState);

    }, [docMetaIndex]);


    const handleSnapshot = React.useCallback(async (event: DocMetaSnapshotEvent) => {

        for (const mutation of event.docMetaMutations) {

            switch (mutation.mutationType) {
                case "created":
                case "updated":
                    const docInfo = await mutation.docInfoProvider();
                    docMetaIndex[mutation.fingerprint] = docInfo;
                    break;
                case "deleted":
                    delete docMetaIndex[mutation.fingerprint];
                    break;

            }

        }

    }, [docMetaIndex]);

    React.useEffect(() => {

        let unsubscriberRef: SnapshotUnsubscriber | undefined;

        async function doAsync() {

            const snapshotResult = await persistenceLayer.snapshot(async event => {

                await handleSnapshot(event);
                rebuildState();

            });

            unsubscriberRef = snapshotResult.unsubscribe;

        }

        doAsync()
            .catch(err => console.error(err));

        return () => {

            if (unsubscriberRef) {
                unsubscriberRef()
            }

        }

    }, [handleSnapshot, persistenceLayer, rebuildState]);

    return state;

}

/**
 * A resource that is billed and its current value and limit and percentage usage.
 */
interface BilledResource {
    readonly value: number;
    readonly limit: number | undefined;
    readonly usage: Percentage100 | undefined;
}

interface IAccountingUsage {
    readonly storage: BilledResource;
    readonly webCaptures: BilledResource;
}

export function useAccountingUsage(): IAccountingUsage {

    const userInfoContext = useUserInfoContext();
    const accounting = useAccounting();

    const computeStorage = React.useCallback((): BilledResource => {

        const plan = Plans.toV2(userInfoContext?.userInfo?.subscription.plan || 'free');

        const value = accounting.storageInBytes;
        const limit = computeStorageForPlan(userInfoContext?.userInfo?.creationTime, plan);
        const usage = Percentages.calculate(value, limit);

        return {
            value, limit, usage
        };

    }, [accounting.storageInBytes, userInfoContext?.userInfo?.creationTime, userInfoContext?.userInfo?.subscription.plan]);

    const computeWebCaptures = React.useCallback((): BilledResource => {

        const plan = Plans.toV2(userInfoContext?.userInfo?.subscription.plan || 'free');

        const value = accounting.nrWebCaptures;
        const limit = plan.level === 'free' ? 250 : undefined;
        // const limit = 0;

        if (limit === undefined) {

            return {
                value,
                limit: undefined,
                usage: undefined
            };

        } else {

            const usage = Percentages.calculate(value, limit);

            return {
                value, limit, usage
            };

        }

    }, [accounting.nrWebCaptures, userInfoContext?.userInfo?.subscription.plan]);

    const storage = computeStorage();
    const webCaptures = computeWebCaptures();

    return {storage, webCaptures};

}