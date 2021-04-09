import { observer } from "mobx-react-lite";
import React from "react";
import {ActionHandler, useActions} from "../../../web/js/mui/action_menu/UseActions";
import {
    ActionMenuStoreProvider,
    createActionsProvider,
    useActionMenuStore
} from "../../../web/js/mui/action_menu/ActionStore";
import {ActionMenuPopup} from "../../../web/js/mui/action_menu/ActionMenuPopup";

const DebugStoreState = observer(() => {

    const store = useActionMenuStore();

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

    const store = useActionMenuStore();

    return (
        <>
            Store {store.id}
            <DebugStoreState/>
        </>
    );

})


const items = [
    {
        id: 'Alice',
        text: 'Alice'
    },
    {
        id: 'Bob',
        text: 'Bob'
    },
    {
        id: 'Carol',
        text: 'Carol'
    },
];

const itemsProvider = createActionsProvider(items)

const Editor = () => {

    const divRef = React.useRef<HTMLDivElement | null>(null);


    const onAction: ActionHandler = (id) => {
        return {
            type: 'note-link',
            target: id
        }
    }

    const [onKeyDown] = useActions({
        trigger: '[[',
        actionsProvider: itemsProvider,
        onAction
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
            <ActionMenuStoreProvider>
                <>
                    <Editor/>
                    <div>debug: </div>
                    <DebugStore/>
                    <ActionMenuPopup/>
                </>
            </ActionMenuStoreProvider>
        </div>

    )
}

