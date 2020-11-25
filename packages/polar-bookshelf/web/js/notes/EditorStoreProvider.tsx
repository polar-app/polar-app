import {createRXJSStore} from "../react/store/RXJSStore";
import {ckeditor5} from "../../../apps/stories/impl/ckeditor5/CKEditor5BalloonEditor";

export const [EditorStoreProvider, useSetEditorStore, useEditorStore] =
    createRXJSStore<ckeditor5.IEditor | undefined>();
