import {
    createContextMenu,
    IMouseEvent
} from "../repository/js/doc_repo/MUIContextMenu";
import {EPUBIFrameMenu, EPUBIFrameMenuOrigin} from "./EPUBIFrameMenu";

function computeMenuOrigin(event: IMouseEvent): EPUBIFrameMenuOrigin | undefined {

    return {
        clientX: event.clientX,
        clientY: event.clientY,
        target: event.target
    };

}

export const IFrameContextMenu = createContextMenu<EPUBIFrameMenuOrigin>(EPUBIFrameMenu, {computeOrigin: computeMenuOrigin});
