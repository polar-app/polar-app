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

                if (navigator.platform.startsWith("MacIntel")) {
                    return Platform.MACOS;
                } else if (navigator.platform.startsWith("MacPPC")) {
                    return Platform.MACOS;
                } else if (navigator.platform.startsWith("Linux")) {
                    return Platform.LINUX;
                } else if (navigator.platform.startsWith("Win32")) {
                    return Platform.WINDOWS;
                } else if (navigator.platform.startsWith("Win64")) {
                    return Platform.WINDOWS;
                } else if (navigator.platform.startsWith("Android")) {
                    return Platform.ANDROID;
                } else if (navigator.platform.startsWith("iPhone")) {
                    return Platform.IOS;
                } else if (navigator.platform.startsWith("iPad")) {
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
    public static type() {

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

export type PlatformType = 'desktop' | 'mobile' | 'tablet' | 'unknown';
