/**
 * Make sure new Polar users are on the mailing list.
 */
import {AuthHandlers} from './AuthHandler';
import {Mailchimp} from '../../../util/thirdparty/Mailchimp';
import {LocalPrefs} from '../../../util/LocalPrefs';
import {Analytics} from "../../../analytics/Analytics";

/**
 * @NotStale
 */
export class MailingList {

    /**
     * Use the auth handler to subscribe the user but only after they've
     * agreed to sign up on Firebase.
     */
    public static async subscribeWhenNecessary() {

        // TODO: add this back in for 2.0?
        // const authHandler = AuthHandlers.get();
        //
        // const optionalUserInfo = await authHandler.userInfo();
        //
        // if (optionalUserInfo.isPresent()) {
        //
        //     const userInfo = optionalUserInfo.get();
        //
        //     await LocalPrefs.markOnceExecuted('did-mailing-list', async () => {
        //
        //         // NOTE: this will in some situations double subscribe people
        //         // but only if they migrate to a new machine and only if they
        //         // haven't also opted out.
        //
        //         if (userInfo.email) {
        //             try {
        //                 // Analytics.event({category: 'mailing-list', action: 'subscribed'});
        //                 await Mailchimp.subscribe(userInfo.email, userInfo.displayName || "");
        //             } catch (e) {
        //                 // Analytics.event({category: 'mailing-list', action: 'failed'});
        //                 throw e;
        //             }
        //         }
        //
        //     });
        //
        // }

    }

}
