import * as React from "react";

interface ListItemRightProps {
    readonly children: JSX.Element;
}

export const ListItemRight = React.memo(function ListItemRight(props: ListItemRightProps) {
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

