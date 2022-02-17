export namespace LoginURLs {

    export interface ILoginURL {
        readonly email: string | undefined;
    }

    /**
     * Allow the user to set a custom signInSuccessUrl as a param.
     */
    export function parse(): ILoginURL {

        const url = new URL(document.location!.href);

        const email = url.searchParams.get('email') || undefined;

        return {email};

    }

}
