import * as React from 'react';
import {UIDStr} from "./IBlock";

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
