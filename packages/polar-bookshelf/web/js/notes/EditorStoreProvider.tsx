import {createRXJSStore} from "../react/store/RXJSStore";

export const [EditorStoreProvider, useSetEditorStore, useEditorStore] =
    createRXJSStore<ckeditor5.IEditor | undefined>();
