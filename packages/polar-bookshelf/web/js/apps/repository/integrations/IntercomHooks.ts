/* tslint:disable:no-var-keyword prefer-const */
import {useUserInfoContext} from "../auth_handler/UserInfoProvider";
import {IntercomData, toIntercomData} from "../../../analytics/intercom/IntercomAnalytics";

export function useIntercomData(): IntercomData | undefined {

    const context = useUserInfoContext();

    const userInfo = context?.userInfo;

    // tslint:disable-next-line:variable-name
    const app_id = "wk5j7vo0";

    if (! userInfo) {
        return {app_id};
    }

    return toIntercomData({
        uid: userInfo.uid,
        email: userInfo.email,
        created: userInfo.creationTime,
        displayName: userInfo.displayName,
        photoURL: userInfo.photoURL
    })

}


