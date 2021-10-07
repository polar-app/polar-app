import {ExpressFunctions} from '../util/ExpressFunctions';
import {UserRequests} from '../util/UserRequests';
import {ProfileUpdates} from './ProfileUpdates';

/**
 * Creates or re-provisions a group for document sharing.
 */
export const ProfileUpdateFunction = ExpressFunctions.createHookAsync('ProfileUpdateFunction', async (req, res) => {
    return await UserRequests.executeAsync(req, res, ProfileUpdates.exec);
});

