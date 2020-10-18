import * as React from 'react';
import {deepMemo} from "../../react/ReactUtils";
import {DockLayoutManager, DockPanel, DocLayoutProps, FixedDocPanelStateMap} from "./DockLayoutManager";
import { DockLayoutStoreProvider, IDockLayoutStore } from './DockLayoutStore';
import { DockLayoutGlobalHotKeys } from './DockLayoutGlobalHotKeys';


const createInitialStore = (dockPanels: ReadonlyArray<DockPanel>): IDockLayoutStore => {

    const panels: FixedDocPanelStateMap = {};

    for (const docPanel of dockPanels) {

        if (docPanel.type === 'fixed') {
            panels[docPanel.id] = {
                id: docPanel.id,
                width: docPanel.width || 400,
                side: docPanel.side,
                collapsed: false
            };
        }

    }

    return {panels};

};

/**
 * A simple expand/collapse dock with a persistent mode where it stays docked
 * next time you open the UI and a temporary mode too where it expand when the
 * toggle button is pushed.
 *
 */
export const DockLayout2 = deepMemo((props: DocLayoutProps) => {

    const store = createInitialStore(props.dockPanels)

    return (
        <DockLayoutStoreProvider store={store}>
            <>
                <DockLayoutGlobalHotKeys/>
                <DockLayoutManager {...props}/>
            </>
        </DockLayoutStoreProvider>
    );

});
