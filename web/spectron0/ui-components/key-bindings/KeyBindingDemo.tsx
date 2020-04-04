import {GlobalHotKeys, HotKeys, ObserveKeys, IgnoreKeys} from "react-hotkeys";
import * as React from 'react';
import {Input, InputGroup, Form} from "reactstrap";

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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        console.log(event.key);

        // Make sure NO other modifiers are enabled.. control+escape for example.

        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }

        switch (event.key) {

            case 'Enter':
                doFind();
                break;

            case 'Escape':
                doFind();
                break;

            default:
                break;

        }

    };

    // note that react-hotkeys is broken when you listen to 'Enter' on
    // ObserveKeys when using an <input> but it doesn't matter because we can
    // just listen to the key directly

    return (

        <InputGroup size="sm" style={{flexGrow: 1}}>

            <Input placeholder="Enter search terms"
                   autoFocus={true}
                   onKeyDown={event => handleKeyDown(event)}
                   className="p-0 pl-1 pr-1"/>

        </InputGroup>

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

