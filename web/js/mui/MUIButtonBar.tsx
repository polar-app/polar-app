import * as React from "react";
import isEqual from "react-fast-compare";
import clsx from "clsx";

interface IProps {
    readonly children: React.ReactNode;
    readonly style?: React.CSSProperties;
    readonly className?: string;
}


export const MUIButtonBar = React.memo((props: IProps) => {

    const className = clsx("gap-box", props.className);

    return (
        <div style={{
                 display: 'flex',
                 alignItems: 'center',
                 ...(props.style || {})
             }}
             className={className}>

            {props.children}

        </div>
    );
}, isEqual);
