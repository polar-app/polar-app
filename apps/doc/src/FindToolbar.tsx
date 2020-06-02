import * as React from 'react';
import Input from 'reactstrap/lib/Input';
import {Callback, Callback1} from "polar-shared/src/util/Functions";
import Button from 'reactstrap/lib/Button';
import InputGroup from "reactstrap/lib/InputGroup";
import {CloseIcon} from "../../../web/js/ui/icons/FixedWidthIcons";

interface IProps {
    readonly active: boolean | undefined;
    readonly onExecute: Callback1<string>;
    readonly onCancel: Callback;
}

// FIXME: if I run a search, then come back to it and hit escape, it will
// fail to work

// FIXME: show the number of matches too.. .
export const FindToolbar = (props: IProps) => {

    if (! props.active) {
        return null;
    }

    let value: string = "";

    const doFind = () => {
        props.onExecute(value);
    };

    const doCancel = () => {
        props.onCancel();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {

        // note that react-hotkeys is broken when you listen to 'Enter' on
        // ObserveKeys when using an <input> but it doesn't matter because we can
        // just listen to the key directly

        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            // Make sure NO other modifiers are enabled.. control+escape for example.
            return;
        }

        switch (event.key) {

            case 'Enter':
                doFind();
                break;

            case 'Escape':
                doCancel();
                break;

            default:
                break;

        }

    };

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

                    <InputGroup size="sm" style={{flexGrow: 1}}>

                        <Input placeholder="Enter search terms"
                               autoFocus={true}
                               className="p-0 pl-1 pr-1"
                               onKeyDown={event => handleKeyDown(event)}
                               onChange={current => value = current.currentTarget.value}/>

                    </InputGroup>

                    <Button size="sm"
                            color="primary"
                            onClick={() => doFind()}
                            className="ml-2">
                        Find
                    </Button>

                    <Button size="sm"
                            className="m-0 ml-1 p-0"
                            onClick={() => doCancel()}
                            color="clear">

                        <CloseIcon/>

                    </Button>

                </div>

            </div>

        </div>

    );

};
