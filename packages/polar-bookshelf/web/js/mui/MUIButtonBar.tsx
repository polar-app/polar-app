import * as React from "react";
import clsx from "clsx";
import {deepMemo} from "../react/ReactUtils";

interface IProps {
    readonly children: React.ReactNode;
    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly onClick?: (event: React.MouseEvent) => void;
    readonly onMouseDown?: (event: React.MouseEvent) => void;
    readonly onMouseUp?: (event: React.MouseEvent) => void;
}


export const MUIButtonBar = deepMemo(function MUIButtonBar(props: IProps) {

    const className = clsx("gap-box", props.className);

    return (
        <div style={{
                 display: 'flex',
                 alignItems: 'center',
                 flexWrap: 'nowrap',
                 ...(props.style || {})
             }}
             onClick={props.onClick}
             className={className}>

            {props.children}

        </div>
    );
});
