export class Permalinks {

    public static absolute(url: string): string {

        // this does not work on older versions of node 8 that are on Firebase.
        // return URLs.absolute(url, 'https://app.getpolarized.io');

        if (url.startsWith("/")) {
            return `https://app.getpolarized.io${url}`;
        }

        return url;

    }

}
