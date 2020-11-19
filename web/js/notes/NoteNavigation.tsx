import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {useComponentDidMount, useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";

interface IProps {
    readonly children: JSX.Element;
}

export const NoteNavigation = React.memo((props: IProps) => {

    const handleClickAway = React.useCallback(() => {

    }, []);

    const handleClick = React.useCallback(() => {

    }, []);

    const onKeyDownCapture = React.useCallback((event: KeyboardEvent) => {

        switch (event.key) {

            case 'ArrowDown':
                break;

            case 'ArrowUp':
                break;

            case 'Enter':
                console.log("FIXME: got enter");
                break;
            default:
                break;
        }

    }, []);

    useComponentDidMount(() => {
        document.addEventListener('keydown', event => onKeyDownCapture(event), {capture: true});
    })

    useComponentWillUnmount(() => {
        document.removeEventListener('keydown', event => onKeyDownCapture(event), {capture: true});
    })

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div onClick={handleClick}>
                {props.children}
            </div>
        </ClickAwayListener>
    );

});