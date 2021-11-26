import React from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {RoutePathNames} from '../apps/repository/RoutePathNames';
import {useRefWithUpdates} from '../hooks/ReactHooks';
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../keyboard_shortcuts/GlobalKeyboardShortcuts";
import {SIDE_NAV_ENABLED, useSideNavStore} from './SideNavStore';

const globalKeyMap = keyMapWithGroup({
    group: "Side Navigation",
    keyMap: {
        PREV_TAB: {
            name: "Jump to previous doc",
            description: "Jump to previous doc",
            ignorable: false,
            sequences: [
                {
                    keys: 'shift+command+ArrowUp',
                    platforms: ['macos']
                },
                {
                    keys: 'shift+ctrl+ArrowUp',
                    platforms: ['windows', 'linux']
                }]
        },
        NEXT_TAB: {
            name: "Jump to next doc",
            description: "Jump to next doc",
            ignorable: false,
            sequences: [
                {
                    keys: 'shift+command+ArrowDown',
                    platforms: ['macos']
                },
                {
                    keys: 'shift+ctrl+ArrowDown',
                    platforms: ['windows', 'linux']
                }
            ]
        }
    }
});

export const SideNavGlobalHotKeys = React.memo(function SideNavGlobalHotKeys() {

    const {tabs} = useSideNavStore(['tabs']);
    const {pathname} = useLocation();
    const history = useHistory();

    const pages = React.useMemo(() => {
        const pages = [
            { path: RoutePathNames.HOME, exact: true }, // Doc Repo
            { path: RoutePathNames.ANNOTATIONS, exact: false }, // Annotation repo
            { path: RoutePathNames.STATISTICS, exact: false }, // Statistics
            { path: RoutePathNames.NOTES, exact: false }, // Notes
            ...tabs.map(tab => ({ path: tab.url, exact: false })), // Open tabs
            { path: RoutePathNames.SETTINGS, exact: false }, // Settings
        ];

        return pages;
    }, [tabs, ]);

    const doNav = React.useCallback((delta: number) => {
        const currentPage = pages.find(({ exact, path }) => exact ? path === pathname : pathname.startsWith(path));
        if (currentPage) {
            const currentPageIdx = pages.indexOf(currentPage);
            const newPageIdx = Math.min(pages.length - 1, Math.max(0, currentPageIdx + delta))
            history.push(pages[newPageIdx].path);
        }
    }, [pages, pathname, history]);

    const doNavRef = useRefWithUpdates(doNav);

    const globalKeyHandlers = React.useMemo(() => ({
        PREV_TAB: () => doNavRef.current(-1),
        NEXT_TAB: () => doNavRef.current(+1),
    }), [doNavRef]);


    if (! SIDE_NAV_ENABLED) {
        return null;
    }

    return (
        <>
            <GlobalKeyboardShortcuts
                keyMap={globalKeyMap}
                handlerMap={globalKeyHandlers}/>
        </>
    );

});

