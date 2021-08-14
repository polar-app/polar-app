import React from "react";

interface IMUIIconTextProps {
    className?: string;
    style?: React.CSSProperties;
    icon?: JSX.Element;
    margin?: number | string;
}

export const MUIIconText: React.FC<IMUIIconTextProps> = (props) => {
    const { style, className, margin = 16, children, icon } = props;

    return (
        <div style={{ display: 'flex', alignItems: 'center', ...style }} className={className}>
            {icon}
            <div style={{ marginLeft: icon ? margin : 0 }}>{children}</div>
        </div>
    );
};
