import {CIDProvider} from "./CIDProvider";

declare var global: any;

/**
 * @ElectronMainContext
 * @Deprecated Try to remove this functionality as it's somewhat Electron
 * specific
 */
export class RendererAnalyticsService {

    public start(): void {

        global.cidProvider = new CIDProvider(undefined);

    }

}
