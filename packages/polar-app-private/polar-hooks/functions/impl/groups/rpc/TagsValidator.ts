/**
 * Used to validate input on the tags sent via RPC.
 */
import {Tags} from 'polar-shared/src/tags/Tags';
import {TagStr} from '../db/Groups';

const MAX_TAGS = 5;

export class TagsValidator {

    public static validate(tags: ReadonlyArray<TagStr> = []) {

        if (tags.length > MAX_TAGS) {
            throw new Error("Too many tags.  May not exceed: " + MAX_TAGS);
        }

        // make sure every tag we're using is valid so that the user doesn't
        // attempt to implement an XSS attack or break our URL namespace.
        tags.forEach(tag => Tags.assertValid(tag));

        return tags;

    }

}
