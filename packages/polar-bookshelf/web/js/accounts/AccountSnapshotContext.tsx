import React from "react";
import {Accounts, AccountSnapshot} from "./Accounts";
import {Logger} from "polar-shared/src/logger/Logger";
import {
    AuthHandlers,
    AuthStatus
} from "../apps/repository/auth_handler/AuthHandler";
import {Tracer} from "polar-shared/src/util/Tracer";

const log = Logger.create();

export interface AuthStatusProps {
    readonly authStatus: AuthStatus;
}

export const AccountSnapshotContext = React.createContext<AccountSnapshot>(undefined);
export const AuthStatusContext = React.createContext<AuthStatusProps>({authStatus: undefined});

interface IProps {
    readonly children: React.ReactNode;
}

// FIXME: this isn't just specific to account context now.

export const AccountContextSubscriber = (props: IProps) => {

    const [account, setAccount] = React.useState<AccountSnapshot>(undefined);
    const [authStatus, setAuthStatus] = React.useState<AuthStatus>(undefined);

    const doAuthStatus = () => {

        const authHandler = AuthHandlers.get();

        const handleStatus = async () => {
            const authStatus = await Tracer.async(authHandler.status(), 'auth-handler-context');
            setAuthStatus(authStatus);
        };

        handleStatus().catch(err => log.error(err));

    };

    const doAccount = () => {
        Accounts.onSnapshot(account => setAccount(account))
            .catch(err => log.error(err));
    };

    doAuthStatus();
    doAccount();

    return (
        <AccountSnapshotContext.Provider value={account}>
            <AuthStatusContext.Provider value={{authStatus}}>
                {props.children}
            </AuthStatusContext.Provider>
        </AccountSnapshotContext.Provider>
    )

};
