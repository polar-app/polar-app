
export namespace AppSites {

    /**
     * We need a way to determine that the URL is an app URL when we redirect and
     * for other reasons like whether the URL should open in a new window, tab or it
     * should just switch within the app.
     */
    function createAppSites(): ReadonlyArray<string> {

        const schemes = ['http', 'https'];
        const hosts = ['127\.0\.0\.[0-9]+', 'localhost', '192\.168\.1\.[0-9]+', 'dev.getpolarized.io', '10\.20\.11\.165'];
        const ports = [8050, 8500, 8051, 9000, 9500];

        const result = [];
        for (const scheme of schemes) {
            for (const host of hosts) {
                for (const port of ports) {
                    result.push(`${scheme}://${host}:${port}`);
                }
            }
        }

        return result;

    }

    const SITES = [
        'https://app.getpolarized.io',
        'https://beta.getpolarized.io',
        ...createAppSites()
    ];


    /**
     * Return true if this URL is actually part of the app, vs external.
     */
    export function isApp(url: string): boolean {

        for (const site of SITES) {
            if (url.match(site) !== null) {
                return true;
            }
        }

        return false;

    }

}
