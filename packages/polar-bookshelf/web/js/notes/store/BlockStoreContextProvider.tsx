import * as React from 'react';
import {useUserInfoContext} from "../../apps/repository/auth_handler/UserInfoProvider";
import {UIDStr} from "polar-blocks/src/blocks/IBlock";
import {LinearProgress} from "@material-ui/core";

export interface IBlockStoreContext {
    readonly uid: UIDStr;
}

const BlockStoreContext = React.createContext<IBlockStoreContext>(null!);

interface IProps {
    readonly uid: UIDStr;
    readonly children: JSX.Element;
}

export function useBlocksStoreContext() {
    return React.useContext(BlockStoreContext);
}

export const BlockStoreContextProvider = (props: IProps) => {
    return (
        <BlockStoreContext.Provider value={{uid: props.uid}}>
            {props.children}
        </BlockStoreContext.Provider>
    );
}

export const BlockStoreDefaultContextProvider = (props: {children: JSX.Element}) => {

    const userInfoContext = useUserInfoContext();

    if (! userInfoContext) {
        return <LinearProgress/>;
    }

    if (! userInfoContext.userInfo) {
        return <LinearProgress/>;
    }

    return (
        <BlockStoreContextProvider uid={userInfoContext.userInfo?.uid}>
            {props.children}
        </BlockStoreContextProvider>
    )

}
