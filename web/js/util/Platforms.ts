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

        switch (process.platform.toLowerCase()) {

            case 'win32':
                return Platform.WINDOWS;

            case 'darwin':
                return Platform.MACOS;

            case 'linux':
                return Platform.LINUX;

        }

        return Platform.UNKNOWN;

    }

    /**
     * Get the symbol name for the enum.
     */
    public static toSymbol<T>(value: Platform.WINDOWS | Platform.MACOS | Platform.LINUX | Platform.UNKNOWN) {
        return Platform[value];
    }

}

export enum Platform {
    MACOS,
    WINDOWS,
    LINUX,
    UNKNOWN
}
