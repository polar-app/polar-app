import * as React from 'react';
import Input from 'reactstrap/lib/Input';
import {Callback1} from "polar-shared/src/util/Functions";
import {HotKeys} from "react-hotkeys";
import Button from 'reactstrap/lib/Button';

interface IProps {
    readonly active: boolean | undefined;
    readonly onFindExecute: Callback1<string>;
}

const keyMap = {
    EXECUTE: 'control+enter'
};

export const FindBox = (props: IProps) => {

    if (! props.active) {
        return null;
    }

    let value: string = "";

    const doFind = () => {
        props.onFindExecute(value);
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
                backgroundColor: 'var(--primary-background-color)'
             }}>

            <HotKeys keyMap={keyMap} handlers={handlers}>
                <div className="p-1">

                    <div className="mt-1">
                        <Input placeholder="Enter search terms"
                               onClick={() => doFind()}
                               onChange={current => value = current.currentTarget.value}/>

                    </div>

                    <div className="mt-2 text-right">

                        <Button size="sm"
                                color="clear">
                            Cancel
                        </Button>

                        <Button size="sm"
                                color="primary"
                                className="ml-1">
                            Find
                        </Button>

                    </div>

                </div>

            </HotKeys>
        </div>

    );

};

