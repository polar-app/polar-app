import * as React from 'react';
import Input from 'reactstrap/lib/Input';
import {Callback, Callback1} from "polar-shared/src/util/Functions";
import {HotKeys} from "react-hotkeys";
import Button from 'reactstrap/lib/Button';
import InputGroup from "reactstrap/lib/InputGroup";
import {CloseIcon} from "../../../web/js/ui/icons/FixedWidthIcons";

interface IProps {
    readonly active: boolean | undefined;
    readonly onExecute: Callback1<string>;
    readonly onCancel: Callback;
}

const keyMap = {
    EXECUTE: 'enter'
};

export const FindBox = (props: IProps) => {

    if (! props.active) {
        return null;
    }

    let value: string = "";

    const doFind = () => {
        props.onExecute(value);
    };

    const handlers = {
        EXECUTE: () => {
            doFind();
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

                    <HotKeys keyMap={keyMap}
                             handlers={handlers}
                             style={{flexGrow: 1, display: 'flex'}}>
                        <InputGroup size="sm" style={{flexGrow: 1}}>

                            <Input placeholder="Enter search terms"
                                   autoFocus={true}
                                   onClick={() => doFind()}
                                   onChange={current => value = current.currentTarget.value}/>

                        </InputGroup>
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

};

