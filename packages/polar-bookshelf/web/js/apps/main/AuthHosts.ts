/**
 * Get the list of domains that are allowed for authentication.
 */
export class AuthHosts {

    public static get(): ReadonlyArray<string> {

        return [
            "accounts.google.com",
            "accounts.youtube.com",
            "polar-32b0f.firebaseapp.com",
            "accountchooser.com",
            "www.accountchooser.com",
            "localhost"
        ];

    }
}
