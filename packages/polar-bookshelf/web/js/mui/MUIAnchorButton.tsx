import * as React from 'react';
import Button, {ButtonProps} from '@material-ui/core/Button';
import {useAnchorClickHandler} from "./MUIAnchor";
import {deepMemo} from "../react/ReactUtils";

interface IMUIAnchorButton extends Exclude<ButtonProps, 'onClick'> {

    /**
     * The href is required here.
     */
    readonly href: string;

}

export const MUIAnchorButton = deepMemo((props: IMUIAnchorButton) => {

    const handleClick = useAnchorClickHandler(props.href);

    return (
        <Button {...props} href={props.href} onClick={handleClick}>
            {props.children}
        </Button>
    );

});
