import React from 'react';
import {toUserInfo, UserInfo} from "./AuthHandler"
import {useFirestore} from "../../../../../apps/repository/js/FirestoreProvider";
import {AccountSnapshots} from "../../../accounts/AccountSnapshots";

interface IUserInfoContext {
    /**
     * The UserInfo or undefined if the user is not logged in.
     */
    readonly userInfo: UserInfo | undefined;
}

/**
 * The IUserInfoContext or undefined if it has not yet been set.
 */
const UserInfoContext = React.createContext<IUserInfoContext | undefined>(undefined);

export function useUserInfoContext() {
    return React.useContext(UserInfoContext);
}

interface IProps {
    readonly children: React.ReactNode;
}

export const UserInfoProvider = React.memo((props: IProps) => {

    const [userInfoContext, setUserInfoContext] = React.useState<IUserInfoContext | undefined>(undefined);
    const {user, firestore} = useFirestore();

    if (user) {

        const accountSnapshots = AccountSnapshots.create(firestore);

        accountSnapshots.onSnapshot(user.uid, account => {
            const newUserInfo = toUserInfo(user, account);
            setUserInfoContext({userInfo: newUserInfo});
        });

    }

    return (
        <UserInfoContext.Provider value={userInfoContext}>
            {props.children}
        </UserInfoContext.Provider>
    )

});
