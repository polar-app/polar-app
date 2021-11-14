import * as React from 'react';

import Button, { ButtonProps } from '@material-ui/core/Button';

type IPropsBase = Exclude<ButtonProps, 'onClick'>;

interface IPropsWithHref extends IPropsBase {
    readonly href: string;
}

interface IPropsWithTo extends IPropsBase {
    readonly to: object | string;
}

export type IAnchorProps = IPropsWithHref | IPropsWithTo;


export const MUIAnchorButton = React.memo((props: IAnchorProps) => {
    return (
        <Button {...props} href={props.href} >
            {props.children}
        </Button>
    );
    
});