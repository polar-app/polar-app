import React from "react";
import {createStoreContext} from "../../react/store/StoreContext";
import {BlockOverflowMenuPopper} from "./BlockOverflowMenuPopper";
import {BlockOverflowMenuStore} from "./BlockOverflowMenuStore";


export const [BlockOverflowMenuStoreProvider, useBlockOverflowMenuStore] = createStoreContext(() => {
    return React.useMemo(() => new BlockOverflowMenuStore(), []);
});

export const BlockOverflowMenuProvider: React.FC = (props) => {
    const { children } = props;

    return (
        <BlockOverflowMenuStoreProvider>
            {children}
            <BlockOverflowMenuPopper />
        </BlockOverflowMenuStoreProvider>
    );
};
