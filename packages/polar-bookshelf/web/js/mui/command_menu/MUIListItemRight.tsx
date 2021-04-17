import * as React from "react";

interface IProps {
    readonly children: JSX.Element;
}

export const MUIListItemRight = React.memo(function MUIListItemRight(props: IProps) {
    return (
        <div style={{
            top: '50%',
            // right: '16px',
            right: '0px',
            position: 'absolute',
            transform: 'translateY(-50%)'
        }}>
            {props.children}
        </div>
    );
});
