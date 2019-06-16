import {TagStr} from './Groups';
import {Image} from './Images';

export interface ProfileInit {

    readonly name?: string;

    /**
     * The image of the user from their profile.
     */
    readonly image?: Image;

    /**
     * The user handle of this profile.  A unique name for this account that's
     * a global reference for this user like 'alice101' or 'burtonator'.
     */
    readonly handle?: string;

    /**
     * User entered bio for their profile.
     */
    readonly bio?: string;

    /**
     * Allow the user to pick at most 5 tags for the document.
     */
    readonly tags?: ReadonlyArray<TagStr>;

    readonly links?: ReadonlyArray<string>;

    /**
     * The physical location for the user.
     */
    readonly location?: string;

}
