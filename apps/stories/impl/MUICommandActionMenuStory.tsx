import { observer } from "mobx-react-lite";
import React from "react";
import {useCommandActionMenu} from "../../../web/js/mui/command_action/UseCommandActionMenu";
import {CommandActionMenuStoreProvider, useCommandActionMenuStore} from "../../../web/js/mui/command_action/CommandActionMenuStore";


const DebugStoreState = observer(() => {

    const store = useCommandActionMenuStore();

    if (! store.state) {
        return null;
    }

    return (
        <>
            <b>position left: </b> {store.state.position.left} <br/>
            <b>position top: </b> {store.state.position.top} <br/>
        </>
    );

})


const DebugStore = observer(() => {

    const store = useCommandActionMenuStore();

    return (
        <>
            Store {store.id}
            <DebugStoreState/>
        </>
    );

})

const Editor = () => {

    const divRef = React.useRef<HTMLDivElement | null>(null);

    const [onKeyDown] = useCommandActionMenu({
        trigger: '[['
    });

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1
        }}>

            <div ref={divRef}
                 contentEditable={true}
                 spellCheck={false}
                 onKeyUp={event => onKeyDown(event, divRef.current)}
                 style={{
                     outline: 'none',
                 }}
                 dangerouslySetInnerHTML={{__html: "this is the content"}}/>

        </div>
    );

}


export const MUICommandActionMenuStory = () => {

    return (
        <CommandActionMenuStoreProvider>
            <>
                <Editor/>
                <div>debug: </div>
                <DebugStore/>
            </>
        </CommandActionMenuStoreProvider>
    )
}

