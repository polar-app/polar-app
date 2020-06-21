import {Optional} from "polar-shared/src/util/ts/Optional";
import {URLs} from "polar-shared/src/util/URLs";
import {AppRuntime} from "polar-shared/src/util/AppRuntime";

export namespace SignInSuccessURLs {

    /**
     * Get the right sign in URL either the default or a custom if specified
     * by a URL param.
     */
    export function get() {
        return Optional.first(getCustom(), getDefault()).get();
    }

    export function createSignInURL(signInSuccessUrl: string, base: string = document.location?.href) {
        return base + "?signInSuccessUrl=" + encodeURIComponent(signInSuccessUrl);
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

        const signInPath
            = AppRuntime.isBrowser() ? "/" : '/#configured';

        return new URL(signInPath, base).toString();

    }

}
