
export class AppOrigin {

    public static configure() {

        if (document && document.location && document.location.href) {

            if (document.location.hostname.indexOf('getpolarized.io') !== -1) {
                document.domain = 'getpolarized.io';
            }

        }

    }

}
