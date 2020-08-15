import React from 'react';
import ReactDOM from 'react-dom';
import {
    createContextMenu,
    IMouseEvent,
    MenuComponentProps,
    MouseEvents,
    useContextMenu
} from "../repository/js/doc_repo/MUIContextMenu";
import {MUIMenuItem} from "../../web/js/mui/menu/MUIMenuItem";
import {useComponentDidMount} from "../../web/js/hooks/ReactLifecycleHooks";
import {createQuerySelector, QuerySelectorProps} from "./QuerySelector";
import {deepMemo} from "../../web/js/react/ReactUtils";
import {
    EPUBIFrameContextProvider,
    useEPUBIFrameContext
} from './EPUBIFrameContext';

const IFrameContent = React.memo(() => {

    const content = `    
        <html>
        <body>

        <p>
            first para
        </p>

        <p>
            second para
        </p>

        </body>
        </html>
    `;

    return (
        <div>
            <iframe srcDoc={content}></iframe>
        </div>
    );
});

// FIXME: Am going to have to inject the event listener into the root or just
// use a window event listener?
//
const IFrameMenu = (props: MenuComponentProps<IFrameMenuOrigin>) => {

    function handleCreatePagemark() {
        console.log(props.origin!.target);
    }

    return (
        <>
            <MUIMenuItem text="Create Pagemark" onClick={handleCreatePagemark}/>
        </>
    );

}

export interface IFrameMenuOrigin {

    readonly clientX: number;
    readonly clientY: number;
    readonly target: EventTarget | null;

}


export function computeMenuOrigin(event: IMouseEvent): IFrameMenuOrigin | undefined {

    return {
        clientX: event.clientX,
        clientY: event.clientY,
        target: event.target
    };

}

const IFrameContextMenu = createContextMenu<IFrameMenuOrigin>(IFrameMenu, {computeOrigin: computeMenuOrigin});

const EPUBIFrameWindowEventListener = () => {

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

const EPUBIFrameContextMenuHost = () => (
    <IFrameContextMenu>
        <EPUBIFrameWindowEventListener/>
    </IFrameContextMenu>
)

const EPUBIFrameMenuPortal = () => {
    console.log("FIXME2.0");
    const iframe = useEPUBIFrameContext();
    console.log("FIXME2.1");
    return ReactDOM.createPortal(<EPUBIFrameContextMenuHost/>, iframe.contentDocument!.body);
}

interface EPUBContextMenuFinderContextProps {
    readonly element: HTMLIFrameElement;
}

// sets up finder and context
// FIXME: make this a memo so it can never re-render
const EPUBContextMenuFinderContext = (props: EPUBContextMenuFinderContextProps) => {

    console.log("FIXME1");

    return (
        <EPUBIFrameContextProvider element={props.element}>
            <EPUBIFrameMenuPortal/>
        </EPUBIFrameContextProvider>
    );

};

const IFrameQuerySelector = createQuerySelector<HTMLIFrameElement>();

const EPUBContextMenuRoot = deepMemo(() => {

    return (
        <IFrameQuerySelector component={EPUBContextMenuFinderContext}
                             selector={() => document.querySelector('iframe')}/>
    );
});

export const App = () => (
    <div>
        <IFrameContent/>
        <EPUBContextMenuRoot/>
    </div>
);
