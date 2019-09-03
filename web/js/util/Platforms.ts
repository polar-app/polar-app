export class Platforms {

    /*
     *
     * The variable to use would be process.platform
     *
     * On Mac the variable returns darwin. On Windows, it returns win32 (even on 64 bit).
     *
     * Possible values are: 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
     *
     * I just set this at the top of my jakeFile:
     *
     * var isWin = process.platform === "win32";
     */
    public static get(): Platform {

        if (typeof process !== 'undefined' && process.platform) {

            // NodeJS and Electron

            switch (process.platform.toLowerCase()) {

                case 'win32':
                    return Platform.WINDOWS;

                case 'darwin':
                    return Platform.MACOS;

                case 'linux':
                    return Platform.LINUX;

            }

        }

        if (typeof navigator !== 'undefined') {

            if (navigator.platform) {

                if (navigator.userAgent.indexOf("MacIntel") !== -1) {
                    return Platform.MACOS;
                } else if (navigator.userAgent.indexOf("MacPPC") !== -1) {
                    return Platform.MACOS;
                } else if (navigator.userAgent.indexOf("Linux") !== -1) {
                    return Platform.LINUX;
                } else if (navigator.userAgent.indexOf("Win32") !== -1) {
                    return Platform.WINDOWS;
                } else if (navigator.userAgent.indexOf("Win64") !== -1) {
                    return Platform.WINDOWS;
                } else if (navigator.userAgent.indexOf("Android") !== -1) {
                    return Platform.ANDROID;
                } else if (navigator.userAgent.indexOf("iPhone") !== -1) {
                    return Platform.IOS;
                } else if (navigator.userAgent.indexOf("iPad") !== -1) {
                    return Platform.IOS;
                }

            }

        }

        // otherwise get it from the user agent.

        return Platform.UNKNOWN;

    }

    /**
     * Return the platform type (desktop or mobile)
     */
    public static type(): PlatformType {

        const platform = this.get();

        if ([Platform.MACOS, Platform.WINDOWS, Platform.LINUX].includes(platform)) {
            return 'desktop';
        }

        if ([Platform.ANDROID, Platform.IOS].includes(platform)) {
            return 'mobile';
        }

        return 'unknown';

    }

    /**
     * Get the symbol name for the enum.
     */
    public static toSymbol<T>(value: PlatformEnumType) {
        return Platform[value];
    }

}

export enum Platform {
    MACOS,
    WINDOWS,
    LINUX,
    ANDROID,
    IOS,
    UNKNOWN
}

export type PlatformEnumType
    = Platform.WINDOWS |
      Platform.MACOS |
      Platform.LINUX |
      Platform.ANDROID |
      Platform.IOS |
      Platform.UNKNOWN;

export type PlatformType = 'desktop' | 'mobile' | 'unknown';
