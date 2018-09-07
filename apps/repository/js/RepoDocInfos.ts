import {isPresent} from '../../../web/js/Preconditions';

export class RepoDocInfos {

    public static isValid(repoDocInfo: RepoDocInfo) {

        if (isPresent(repoDocInfo.filename)) {
            return true;
        } else {
            return false;
        }

    }

}
