import React from 'react';
import {toUserInfo, UserInfo} from "./AuthHandler"
import {useFirestore} from "../../../../../apps/repository/js/FirestoreProvider";
import {AccountSnapshots} from "../../../accounts/AccountSnapshots";

const UserInfoContext = React.createContext<UserInfo | undefined>(undefined);

export function useUserInfoContext() {
    return React.useContext(UserInfoContext);
}

interface IProps {
    readonly children: React.ReactElement;
}

export const UserInfoProvider = React.memo((props: IProps) => {

    const [userInfo, setUserInfo] = React.useState<UserInfo | undefined>(undefined);
    const {uid, user, firestore} = useFirestore();

    if (user) {

        const accountSnapshots = AccountSnapshots.create(firestore);

        accountSnapshots.onSnapshot(user.uid, account => {
            const newUserInfo = toUserInfo(user, account);
            setUserInfo(newUserInfo);
        });

    }

    return (
        <UserInfoContext.Provider value={userInfo}>
            {props.children}
        </UserInfoContext.Provider>
    )

});
