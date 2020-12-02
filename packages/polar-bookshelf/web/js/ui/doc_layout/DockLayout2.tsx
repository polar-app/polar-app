import * as React from 'react';
import {deepMemo} from "../../react/ReactUtils";
import {DockLayoutManager, DockPanel, DocLayoutProps, FixedDocPanelStateMap} from "./DockLayoutManager";
import { DockLayoutStoreProvider, IDockLayoutStore } from './DockLayoutStore';
import { DockLayoutGlobalHotKeys } from './DockLayoutGlobalHotKeys';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

const createInitialPanels = (dockPanels: ReadonlyArray<DockPanel>): FixedDocPanelStateMap => {

    const panels: FixedDocPanelStateMap = {};

    for (const docPanel of dockPanels) {

        if (docPanel.type === 'fixed') {
            panels[docPanel.id] = {
                id: docPanel.id,
                width: docPanel.width || 400,
                side: docPanel.side,
                collapsed: docPanel.collapsed || false
            };
        }

    }

    return panels;

};

/**
 * A simple expand/collapse dock with a persistent mode where it stays docked
 * next time you open the UI and a temporary mode too where it expand when the
 * toggle button is pushed.
 *
 */
export const DockLayout2 = deepMemo((props: DocLayoutProps) => {

    const panels = React.useMemo(() => createInitialPanels(props.dockPanels), [props.dockPanels]);
    const store = React.useMemo((): IDockLayoutStore => {
        return {
            panels,
            onResize: props.onResize || NULL_FUNCTION
        }
    }, [panels, props.onResize]);

    return (
        <DockLayoutStoreProvider store={store}>
            <>
                <DockLayoutGlobalHotKeys/>
                <DockLayoutManager {...props}/>
            </>
        </DockLayoutStoreProvider>
    );

});
