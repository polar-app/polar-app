import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import {Provider} from "polar-shared/src/util/Providers";
import {Callback1} from "polar-shared/src/util/Functions";

interface IDocActions {
}

interface IDocActionPrimaryCallbacks {
    readonly onTagRequested: Callback1<ReadonlyArray<RepoDocInfo>>;
    readonly onArchived: Callback1<ReadonlyArray<RepoDocInfo>>;
    readonly onFlagged: Callback1<ReadonlyArray<RepoDocInfo>>;
}


export namespace DocActions {

    export namespace DocToolbar {

        export interface Actions {
            readonly onDelete: () => void;
            readonly onArchived: () => void;
            readonly onFlagged: () => void;
        }

        export interface Callbacks {
            readonly onTagged: Callback1<ReadonlyArray<RepoDocInfo>>;
            readonly onDelete: Callback1<ReadonlyArray<RepoDocInfo>>;
            readonly onArchived: Callback1<ReadonlyArray<RepoDocInfo>>;
            readonly onFlagged: Callback1<ReadonlyArray<RepoDocInfo>>;
        }
    }

    export function createDocToolbar(selectedProvider: Provider<ReadonlyArray<RepoDocInfo>>,
                                     callbacks: DocToolbar.Callbacks): DocToolbar.Actions {

        const selected = selectedProvider();
        const first = selected.length >= 1 ? selected[0] : undefined;

        return {

            onDelete: () => callbacks.onDelete(selected),
            onArchived: () => callbacks.onArchived(selected),
            onFlagged: () => callbacks.onFlagged(selected),

        };
    }

    export namespace DocContextMenu  {

        export interface Actions {
            readonly onOpen: () => void;
            readonly onRename: () => void;
            readonly onShowFile: () => void;
            readonly onCopyOriginalURL: () => void;
            readonly onCopyFilePath: () => void;
            readonly onCopyDocumentID: () => void;
            readonly onDelete: () => void;
            readonly onArchived: () => void;
            readonly onFlagged: () => void;
        }

        export interface Callbacks {
            readonly onTagged: Callback1<ReadonlyArray<RepoDocInfo>>;
            readonly onOpen: Callback1<RepoDocInfo>;
            readonly onRename: Callback1<RepoDocInfo>;
            readonly onShowFile: Callback1<RepoDocInfo>;
            readonly onCopyOriginalURL: Callback1<RepoDocInfo>;
            readonly onCopyFilePath: Callback1<RepoDocInfo>;
            readonly onCopyDocumentID: Callback1<RepoDocInfo>;
            readonly onDeleted: (repoDocInfos: ReadonlyArray<RepoDocInfo>) => void;
            readonly onArchived: Callback1<ReadonlyArray<RepoDocInfo>>;
            readonly onFlagged: Callback1<ReadonlyArray<RepoDocInfo>>;
        }

    }

    export function createDocContextMenu(selectedProvider: Provider<ReadonlyArray<RepoDocInfo>>,
                                         callbacks: DocContextMenu.Callbacks): DocContextMenu.Actions {

        // must be created on init we have a stable copy
        const selected = selectedProvider();
        const first = selected.length >= 1 ? selected[0] : undefined;

        return {

            onOpen: () => callbacks.onOpen(first!),
            onRename: () => callbacks.onRename(first!),
            onShowFile: () => callbacks.onShowFile(first!),
            onCopyOriginalURL: () => callbacks.onCopyOriginalURL(first!),
            onCopyFilePath: () => callbacks.onCopyFilePath(first!),
            onCopyDocumentID: () => callbacks.onCopyDocumentID(first!),
            onDelete: () => callbacks.onDeleted(selected),
            onArchived: () => callbacks.onArchived(selected),
            onFlagged: () => callbacks.onFlagged(selected),

        };

    }

}

