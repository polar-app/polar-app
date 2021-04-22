import {Platforms, PlatformStr} from "polar-shared/src/util/Platforms";
import {Version} from "polar-shared/src/util/Version";
import { AppRuntime, AppRuntimeID } from "polar-shared/src/util/AppRuntime";
import {Device, Devices} from "polar-shared/src/util/Devices";

export namespace StandardEventProperties {

    export interface IStandardEventProperties {

        readonly platform: PlatformStr;
        readonly runtime: AppRuntimeID;
        readonly device: Device;

        readonly version_major: string;
        readonly version_minor: string;
        readonly version: string;

        readonly hostname: string;

    }

    export function create(): IStandardEventProperties {

        const platform = Platforms.toSymbol(Platforms.get());
        const version = Version.tokenized();
        const runtime = AppRuntime.get();
        const device = Devices.get();

        const hostname = typeof document !== 'undefined' ? document.location.hostname : '';

        return {platform, ...version, runtime, device, hostname};

    }

}

