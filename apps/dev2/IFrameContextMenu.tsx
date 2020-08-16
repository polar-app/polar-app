import {
    createContextMenu,
    IMouseEvent
} from "../repository/js/doc_repo/MUIContextMenu";
import {EPUBIFrameMenu} from "./EPUBIFrameMenu";
import {IFrameMenuOrigin} from "./App";

function computeMenuOrigin(event: IMouseEvent): IFrameMenuOrigin | undefined {

    return {
        clientX: event.clientX,
        clientY: event.clientY,
        target: event.target
    };

}

export const IFrameContextMenu = createContextMenu<IFrameMenuOrigin>(EPUBIFrameMenu, {computeOrigin: computeMenuOrigin});
