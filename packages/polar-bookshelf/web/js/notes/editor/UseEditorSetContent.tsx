import {useEditorStore} from "../EditorStoreProvider";
import * as React from "react";

export function useEditorSetContent() {

    const editor = useEditorStore();

    return React.useCallback((content: string) => {

        if (! editor) {
            throw new Error("useEditorSetContent: No editor");
        }

        editor.setData(content);

    }, [editor])

}
