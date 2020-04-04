import {GlobalHotKeys, HotKeys, ObserveKeys} from "react-hotkeys";
import * as React from 'react';
import {Input, InputGroup} from "reactstrap";

// FIXME: add supprt for getting all the active key bindings and showing them
// via control+?
//
// https://github.com/greena13/react-hotkeys#displaying-a-list-of-available-hot-keys
//
// use a lightbox for this??

const globalKeyMap = {
    FIND: "f",
};

interface DocumentRowProps {
    readonly id: string;
    readonly title: string;
    readonly author: string;
}

const DocumentRow = (props: DocumentRowProps) => {

    const keyMap = {
        DELETE: "backspace",
    };

    const handlers = {
        DELETE: React.useCallback(() => {
            console.log("Got delete for " + props.id);
        }, [])

    };

    return (
        <HotKeys keyMap={keyMap} handlers={handlers}>
            <div style={{display: "flex"}}>
                <div className="p-1">{props.title}</div>
                <div className="p-1">{props.author}</div>
            </div>
        </HotKeys>
    );

};

const DocumentTable = (props: any) => (
    <div>
        {props.children}
    </div>
);

const DocumentFilter = () => {

    let ref: HTMLInputElement | null;

    const doSelect = React.useCallback(() => {

        if (ref) {
            ref.focus();
        }

    }, []);

    const handlers = {
        FIND: doSelect
    };

    return (
        <GlobalHotKeys handlers={handlers}>
            <div className="mt-1 mb-1">
                <Input placeholder="search for a book" innerRef={_ref => ref = _ref}/>
            </div>
        </GlobalHotKeys>

    );

};

const FindToolbar = () => {

    const doFind = () => {
        console.log("doFind");
    };

    const doCancel = () => {
        console.log("doCancel");
    };

    const keyMap = {
        EXECUTE: 'enter',
        CANCEL: 'escape'
    };

    const handlers = {
        EXECUTE: () => doFind(),
        CANCEL: () => doCancel()
    };

    return (

        <HotKeys keyMap={keyMap}
                 handlers={handlers}
                 style={{flexGrow: 1, display: 'flex'}}>
            <ObserveKeys
                only={[
                    'escape', 'enter'
                ]}>
                <InputGroup size="sm" style={{flexGrow: 1}}>

                    <Input placeholder="Enter search terms"
                           autoFocus={true}
                           onClick={() => doFind()}
                           className="p-0 pl-1 pr-1"/>

                </InputGroup>
            </ObserveKeys>

        </HotKeys>

    );

};

export const KeyBindingDemo = () => {

    return (

        <div>

            <GlobalHotKeys keyMap={globalKeyMap}>

                This is a react key binding demo

                <FindToolbar/>

                <DocumentFilter/>

                <DocumentTable>
                    <DocumentRow id="1" title="Book 1" author="Alice"/>
                    <DocumentRow id="2" title="Book 2" author="Bob"/>
                </DocumentTable>

            </GlobalHotKeys>

        </div>

    );

};

