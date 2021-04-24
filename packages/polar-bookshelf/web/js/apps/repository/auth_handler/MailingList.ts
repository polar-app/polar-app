import {AuthStatus} from './AuthHandler';
import {Mailchimp} from '../../../util/thirdparty/Mailchimp';
import {LocalPrefs} from '../../../util/LocalPrefs';
import {Analytics} from "../../../analytics/Analytics";

/**
 * Make sure new Polar users are on the mailing list.
 */
export class MailingList {

    /**
     * Use the auth handler to subscribe the user but only after they've
     * agreed to sign up on Firebase.
     */
    public static async subscribeWhenNecessary(authStatus: AuthStatus) {

        if (! authStatus.user) {
            return;
        }

        const {email, displayName} = authStatus.user;

        if (! email) {
            return;
        }

        await LocalPrefs.markOnceExecuted('did-mailing-list', async () => {

            // NOTE: this will in some situations double subscribe people
            // but only if they migrate to a new machine and only if they
            // haven't also opted out.

            try {
                Analytics.event({category: 'mailing-list', action: 'subscribed'});
                await Mailchimp.subscribe(email, displayName || "");
            } catch (e) {
                Analytics.event({category: 'mailing-list', action: 'failed'});
                throw e;
            }

        });

    }

}
