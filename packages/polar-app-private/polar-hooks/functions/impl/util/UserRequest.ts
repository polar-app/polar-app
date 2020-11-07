/**
 * A request payload targeting a specific user. We include the idToken so that we
 * can decode the token and determine the user that executed the request.
 *
 * Separating the value from the idToken means we avoid accidentally copying
 * the idToken in rest (...) arguments but also avoid conflating object usage.
 */
export interface UserRequest<B> {

    /**
     * The token to authenticate the user.
     */
    readonly idToken: IDTokenStr;

    /**
     * The actual request JSON body
     */
    readonly body: B;

}

export type IDTokenStr = string;
