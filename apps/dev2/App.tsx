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
import {createQuerySelector} from "./QuerySelector";
import {deepMemo} from "../../web/js/react/ReactUtils";
import {
    EPUBIFrameContextProvider,
    useEPUBIFrameContext
} from './EPUBIFrameContext';
import { EPUBIFrameMenu } from './EPUBIFrameMenu';
import { EPUBIFrameWindowEventListener } from './EPUBIFrameWindowEventListener';
import {IFrameContextMenu} from "./IFrameContextMenu";

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


export interface IFrameMenuOrigin {

    readonly clientX: number;
    readonly clientY: number;
    readonly target: EventTarget | null;

}

const EPUBIFrameContextMenuHost = deepMemo(() => (
    <IFrameContextMenu>
        <EPUBIFrameWindowEventListener/>
    </IFrameContextMenu>
));

const EPUBIFrameMenuPortal = deepMemo(() => {
    const iframe = useEPUBIFrameContext();
    return ReactDOM.createPortal(<EPUBIFrameContextMenuHost/>, iframe.contentDocument!.body);
});

interface EPUBContextMenuFinderContextProps {
    readonly element: HTMLIFrameElement;
}

// sets up finder and context
// FIXME: make this a memo so it can never re-render
const EPUBContextMenuFinderContext = (props: EPUBContextMenuFinderContextProps) => {

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
