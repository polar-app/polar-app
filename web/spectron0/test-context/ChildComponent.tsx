import * as React from 'react';
import {UIModeContext} from './UIModeContext';
import Button from "@material-ui/core/Button";

export const ChildComponent = () => (
    <UIModeContext.Consumer>
        {
            ({mode, setMode}) => (
                <div>
                    <div>mode: {mode}</div>
                    <Button onClick={() => setMode('light')}>toggle</Button>
                </div>
            )
        }
    </UIModeContext.Consumer>
);
