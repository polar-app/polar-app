import * as React from 'react';
import {useLinkLoader} from "../ui/util/LinkLoaderHook";
import Button from "@material-ui/core/Button";
import { deepMemo } from "../react/ReactUtils";
import { PropTypes } from '@material-ui/core';

interface IProps {

    /**
     * The URL href that we're going to load.
     */
    readonly href: string;
    readonly variant: 'outlined' | 'contained';
    readonly children: React.ReactNode;
    readonly color?: PropTypes.Color;
    readonly size?: 'small' | 'medium' | 'large';
}

export const MUILinkLoaderButton = deepMemo(function MUILinkLoaderButton(props: IProps) {

    const linkLoader = useLinkLoader();

    const handleClick = React.useCallback(() => {
        linkLoader(props.href, {newWindow: true, focus: true});
    }, [linkLoader, props])

    return (
        <Button variant={props.variant}
                color={props.color}
                size={props.size}
                onClick={handleClick}>
            {props.children}
        </Button>
    );

});
