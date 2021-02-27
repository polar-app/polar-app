import { observer } from "mobx-react-lite";
import React from "react";
import {useCommandActionMenu} from "../../../web/js/mui/action_menu/UseCommandActionMenu";
import {
    CommandActionMenuStoreProvider,
    createItemsProvider,
    useCommandActionMenuStore
} from "../../../web/js/mui/action_menu/CommandActionMenuStore";


const DebugStoreState = observer(() => {

    const store = useCommandActionMenuStore();

    if (! store.state) {
        return null;
    }

    return (
        <>
            <b>position: </b> {JSON.stringify(store.state.position)} <br/>

            <b>Matching N items: {store.state.items.length}</b>

            {store.state.items.map(current => (
                <div key={current.id}>
                    {current.text}
                </div>
            ))}

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


const itemsProvider = createItemsProvider([
    {
        id: 'alice',
        text: 'Alice'
    },
    {
        id: 'bob',
        text: 'Bob'
    },
])

const Editor = () => {

    const divRef = React.useRef<HTMLDivElement | null>(null);

    const [onKeyDown] = useCommandActionMenu({
        trigger: '[[',
        itemsProvider
    });

    return (

            <div ref={divRef}
                 contentEditable={true}
                 spellCheck={false}
                 onKeyUp={event => onKeyDown(event, divRef.current)}
                 style={{
                     outline: 'none',
                 }}
                 dangerouslySetInnerHTML={{__html: "this is the content"}}/>

    );

}

export const MUICommandActionMenuStory = () => {

    return (
        <div style={{
                 display: 'flex',
                 flexDirection: 'column',
                 flexGrow: 1
             }}>
            <CommandActionMenuStoreProvider>
                <>
                    <Editor/>
                    <div>debug: </div>
                    <DebugStore/>
                </>
            </CommandActionMenuStoreProvider>
        </div>

    )
}

