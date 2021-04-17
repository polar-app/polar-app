import * as React from 'react';
import {deepMemo} from "../../react/ReactUtils";
import {DockLayoutManager, DockPanel, DocLayoutProps, FixedDocPanelStateMap} from "./DockLayoutManager";
import { DockLayoutStoreProvider, IDockLayoutStore } from './DockLayoutStore';
import {Callback, NULL_FUNCTION} from "polar-shared/src/util/Functions";

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

export namespace DockLayout2 {

    export const Main = deepMemo(function Main() {

        return (
            <>
                <DockLayoutManager/>
            </>
        );

    });

    export interface RootProps {
        readonly dockPanels: ReadonlyArray<DockPanel>;
        readonly onResize?: Callback;
        readonly children: JSX.Element;
    }

    /**
     * A simple expand/collapse dock with a persistent mode where it stays docked
     * next time you open the UI and a temporary mode too where it expand when the
     * toggle button is pushed.
     */
    export const Root = deepMemo(function Root(props: RootProps) {

        const panels = React.useMemo(() => createInitialPanels(props.dockPanels), [props.dockPanels]);
        const store = React.useMemo((): IDockLayoutStore => {
            return {
                panels,
                dockPanels: props.dockPanels,
                onResize: props.onResize || NULL_FUNCTION
            }
        }, [panels, props.dockPanels, props.onResize]);

        return (
            <DockLayoutStoreProvider store={store}>
                <>
                    {props.children}
                </>
            </DockLayoutStoreProvider>
        );

    });


}