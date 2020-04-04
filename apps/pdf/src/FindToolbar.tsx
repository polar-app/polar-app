import * as React from 'react';
import Input from 'reactstrap/lib/Input';
import {Callback, Callback1} from "polar-shared/src/util/Functions";
import {configure, HotKeys, ObserveKeys, KeyMapOptions} from "react-hotkeys";
import Button from 'reactstrap/lib/Button';
import InputGroup from "reactstrap/lib/InputGroup";
import {CloseIcon} from "../../../web/js/ui/icons/FixedWidthIcons";

configure({logLevel: 'debug'});

interface IProps {
    readonly active: boolean | undefined;
    readonly onExecute: Callback1<string>;
    readonly onCancel: Callback;
}

// FIXME: if I run a search, then come back to it and hit escape, it will
// fail to work

// FIXME: show the number of matches too.. .
export const FindToolbar = React.memo((props: IProps) => {

    // FIXME: react-hotkeys won't allow us to specify a description here because
    // the types are wrong
    const keyMap = {
        EXECUTE: 'enter',
        CANCEL: 'escape'
    };

    if (! props.active) {
        return null;
    }

    let value: string = "";

    const doFind = () => {
        props.onExecute(value);
    };

    const handlers = {
        EXECUTE: () => doFind(),
        CANCEL: () => {
            console.log("FIXME got it");
            props.onCancel()
        }
    };

    console.log("FIXME: FIND toolbar rendered");

    return (

        <div style={{
            position: 'absolute',
            top: '50px',
            zIndex: 10,
            width: '100%',
        }}>

            <div className="p-1 ml-auto mr-auto border rounded shadow"
                 style={{
                     maxWidth: '400px',
                     backgroundColor: 'var(--primary-background-color)'
                 }}>

                <div className="mt-1 p-1" style={{display: 'flex'}}>

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
                                       className="p-0 pl-1 pr-1"
                                       onChange={current => value = current.currentTarget.value}/>

                            </InputGroup>
                        </ObserveKeys>

                    </HotKeys>

                    <Button size="sm"
                            color="primary"
                            onClick={() => doFind()}
                            className="ml-2">
                        Find
                    </Button>

                    <Button size="sm"
                            className="m-0 ml-1 p-0"
                            onClick={() => props.onCancel()}
                            color="clear">

                        <CloseIcon/>

                    </Button>

                </div>

            </div>

        </div>

    );

}, (before, after) => before.active === after.active);

