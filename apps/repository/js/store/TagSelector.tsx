import { useDocRepoCallbacks } from "../doc_repo/DocRepoStore2";

interface TagSelector {
    readonly onTagSelected: (tags: ReadonlyArray<string>) => void;
}

export function useTagSelector(): TagSelector {

    // FIXME use a context to determine which is the active store/screen.  This is
    // just a simple context to toggle us back and forth
    const docRepoCallbacks = useDocRepoCallbacks();

    function onTagSelected(tags: ReadonlyArray<string>) {
        docRepoCallbacks.onTagSelected(tags);
    }

    return {onTagSelected};

}
