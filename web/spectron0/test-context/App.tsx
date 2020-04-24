import * as React from 'react';
import {useState} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {UIModeContext, UIModeType} from './UIModeContext';
import {ChildComponent} from "./ChildComponent";

export const App = () => {

    const [mode, setMode] = useState<UIModeType>('dark');

    return (
        <UIModeContext.Provider value={{mode, setMode}}>
            <CssBaseline/>

            <ChildComponent/>
        </UIModeContext.Provider>
    );

}

