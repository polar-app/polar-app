import {AppRuntime} from "../../AppRuntime";
import {remote} from "electron";
import {NullExternalNavigationBlock} from "./ExternalNavigationBlock";
import {ExternalNavigationBlockDelegate} from "./ExternalNavigationBlockDelegate";

declare var global: any;

export class ExternalNavigationBlockDelegates {

    public static get(): NullExternalNavigationBlock {

        if (AppRuntime.isElectron()) {

            const runtime = AppRuntime.get();

            if (runtime === 'electron-renderer') {
                return remote.getGlobal("externalNavigationBlock");
            } else if (runtime === 'electron-main') {
                return global.externalNavigationBlock;
            } else {
                return new NullExternalNavigationBlock();
            }

        } else {
            return new NullExternalNavigationBlock();
        }

    }
    public static init() {
        global.externalNavigationBlock = new ExternalNavigationBlockDelegate();
    }
}
