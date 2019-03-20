/**
 * Methods for working with content preview URLs.
 */
export class PreviewURLs {

    /**
     * True if the URL is a preview URL.
     */
    public static isPreview(): boolean {
        const url = new URL(document.location!.href);
        return url.searchParams.get('preview') === 'true';
    }

    /**
     * True if the URL is an auto-add URL and should automatically be added
     * to the users content repo.
     */
    public static isAutoAdd(): boolean {
        const url = new URL(document.location!.href);
        return url.searchParams.get('auto-add') === 'true';
    }

}
