import {AppRuntime} from "../../../../web/js/AppRuntime";
import { Optional } from "polar-shared/src/util/ts/Optional";
import {URLs} from "polar-shared/src/util/URLs";

export class SignInSuccessURLs {

    /**
     * Get the right sign in URL either the default or a custom if specified
     * by a URL param.
     */
    public static get() {

        return Optional.first(this.getCustom(), this.getDefault()).get();

    }

    /**
     * Allow the user to set a custom signInSuccessUrl as a param.
     */
    private static getCustom(): string | undefined {

        const url = new URL(document.location!.href);

        return Optional.of(url.searchParams.get('signInSuccessUrl'))
                       .getOrUndefined();

    }

    private static getDefault(): string {

        const base = URLs.toBase(document.location!.href);

        const signInPath
            = AppRuntime.isBrowser() ? "/" : '/#configured';

        return new URL(signInPath, base).toString();

    }

}
