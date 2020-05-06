import * as React from "react";
import isEqual from "react-fast-compare";

interface IProps {
    readonly children: React.ReactNode;
    readonly style?: React.CSSProperties;
    readonly className?: string;
}


export const MUIButtonBar = React.memo((props: IProps) => {
    return (
        <div style={{
                 display: 'flex',
                 alignItems: 'center',
                 ...(props.style || {})
             }}
             className="gap-box">

            {props.children}

        </div>
    );
}, isEqual);
