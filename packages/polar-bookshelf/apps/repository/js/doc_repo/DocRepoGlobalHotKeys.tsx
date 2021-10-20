import React from "react";
import {useDocRepoCallbacks} from "./DocRepoStore2";
import {Route, Switch} from "react-router-dom";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";
import {useDocMetadataEditorForSelected} from "./doc_metadata_editor/DocMetadataEditorHook";
import useLocationWithPathOnly = ReactRouters.useLocationWithPathOnly;

const globalKeyMap = keyMapWithGroup(
    {
        group: "Documents",
        keyMap: {
            TAG: {
                name: "Tag",
                description: "Tag selected doc",
                sequences: [
                    {
                        keys: 't',
                        platforms: ['macos', 'linux', 'windows']
                    }
                ],
            },
            DELETE: {
                name: "Delete",
                description: "Delete selected doc",
                sequences: [
                    {
                        keys: 'Delete',
                        platforms: ['macos', 'linux', 'windows']
                    },
                    {
                        keys: 'Backspace',
                        platforms: ['macos', 'linux', 'windows']
                    }
                ],
            },
            FLAG: {
                name: "Flag",
                description: "Flag selected doc",
                sequences: [
                    {
                        keys: 'f',
                        platforms: ['macos', 'linux', 'windows']
                    }
                ]
            },
            ARCHIVE: {
                name: "Archive",
                description: "Archive selected doc",
                sequences: [
                    {
                        keys: 'a',
                        platforms: ['macos', 'linux', 'windows']
                    }
                ]
            },
            RENAME: {
                name: "Rename",
                description: "Rename selected doc",
                sequences: [
                    {
                        keys: 'r',
                        platforms: ['macos', 'linux', 'windows']
                    }
                ]
            },
            OPEN: {
                name: "Open",
                description: "Open selected doc in doc viewer",
                sequences: [
                    {
                        keys: 'Enter',
                        platforms: ['macos', 'linux', 'windows']
                    }
                ]
            },
            UPDATE_METADATA: {
                name: "Update Document Metadata",
                description: "Update doc metadata",
                sequences: [
                    {
                        keys: 'm',
                        platforms: ['macos', 'linux', 'windows']
                    }
                ]
            },

        }
    });

export const DocRepoGlobalHotKeys = React.memo(function DocRepoGlobalHotKeys() {

    const callbacks = useDocRepoCallbacks();

    const docMetadataEditorForSelected = useDocMetadataEditorForSelected();

    const globalKeyHandlers = {
        TAG: callbacks.onTagged,
        DELETE: callbacks.onDeleted,
        FLAG: callbacks.onFlagged,
        ARCHIVE: callbacks.onArchived,
        RENAME: callbacks.onRename,
        OPEN: callbacks.onOpen,
        UPDATE_METADATA: docMetadataEditorForSelected
    };

    const location = useLocationWithPathOnly();

    return (
        <Switch location={location}>

            <Route exact path='/'>
                <GlobalKeyboardShortcuts keyMap={globalKeyMap}
                                         handlerMap={globalKeyHandlers}/>
            </Route>

        </Switch>
    );

});
