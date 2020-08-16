import {useEPUBIFrameContext} from "./EPUBIFrameContext";
import {
    IMouseEvent, MouseEvents,
    useContextMenu
} from "../repository/js/doc_repo/MUIContextMenu";
import {useComponentDidMount} from "../../web/js/hooks/ReactLifecycleHooks";

export const EPUBIFrameWindowEventListener = () => {

    const iframe = useEPUBIFrameContext();
    const {onContextMenu} = useContextMenu();

    useComponentDidMount(() => {

        function toEvent(event: MouseEvent): IMouseEvent {
            return MouseEvents.fromNativeEvent(event);
        }

        const win = iframe.contentWindow!;

        win.addEventListener('contextmenu', (event) => onContextMenu(toEvent(event)));

    });

    return null;

}
