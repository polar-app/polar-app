import { Account } from './Account';
import { OnErrorCallback, OnNextCallback } from "polar-shared/src/util/Snapshots";
export declare namespace Accounts {
    function createRef(): Promise<import("firebase").firestore.DocumentReference<import("firebase").firestore.DocumentData> | undefined>;
    function get(): Promise<Account | undefined>;
    function onSnapshot(onNext: OnNextCallback<Account>, onError?: OnErrorCallback): Promise<(() => void) | undefined>;
    function listenForPlanUpgrades(): Promise<void>;
}
