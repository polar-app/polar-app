import {Optional} from "polar-shared/src/util/ts/Optional";
import {URLs} from "polar-shared/src/util/URLs";

export namespace SignInSuccessURLs {

    /**
     * Get the right sign in URL either the default or a custom if specified
     * by a URL param.
     */
    export function get() {
        return Optional.first(getCustom(), getDefault()).get();
    }

    /**
     * Create a sign in URL but only if we need to redirect to a different URL on login.
     */
    export function createSignInURL(signInSuccessUrl: string | undefined,
                                    baseURL: string = document.location?.href) {

        if (signInSuccessUrl && ! URLs.isWebScheme(signInSuccessUrl)) {
            // this is not a valid URL
            return baseURL;
        }

        if (! signInSuccessUrl || signInSuccessUrl.indexOf('/login') !== -1) {
            return baseURL;
        }

        // TODO: if the base URL has query params or named anchors this won't
        // work but URL isn't always supported in node
        return baseURL + "?signInSuccessUrl=" + encodeURIComponent(signInSuccessUrl);

    }

    /**
     * Allow the user to set a custom signInSuccessUrl as a param.
     */
    function getCustom(): string | undefined {

        const url = new URL(document.location!.href);

        return Optional.of(url.searchParams.get('signInSuccessUrl'))
                       .getOrUndefined();

    }

    function getDefault(): string {
        const base = URLs.toBase(document.location!.href);
        return new URL('/', base).toString();

    }

}
