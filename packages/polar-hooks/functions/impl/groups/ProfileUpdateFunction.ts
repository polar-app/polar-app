import {ExpressFunctions} from '../util/ExpressFunctions';
import {UserRequests} from '../util/UserRequests';
import {ProfileUpdates} from './ProfileUpdates';

/**
 * Creates or re-provisions a group for document sharing.
 */
export const ProfileUpdateFunction = ExpressFunctions.createHook('ProfileUpdateFunction', (req, res) => {
    return UserRequests.execute(req, res, ProfileUpdates.exec);
});

