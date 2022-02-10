import {useUserInfoContext} from "../../../../../web/js/apps/repository/auth_handler/UserInfoProvider";

interface IProps {
    readonly ver: 'v2';
    readonly children: JSX.Element;
}

export const WhenAccountLevel = (props: IProps) => {

    const userInfoContext = useUserInfoContext();

    if (props.ver >= (userInfoContext?.userInfo?.ver || 'v0')) {
        return null;
    }

    return props.children;

}
