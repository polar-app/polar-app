import React, {type HTMLAttributes} from "react";
import {SvgIcon} from "styled/SvgIcon";

interface IProps extends HTMLAttributes<SVGSVGElement> {
    readonly style?: React.CSSProperties;
    readonly className?: string;
}

export const Exclude: React.FC<IProps> = (props) => (
    <SvgIcon viewBox="0 0 43 27" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M13.5 26C20.4036 26 26 20.4036 26 13.5C26 6.59644 20.4036 1 13.5 1C6.59644 1 1 6.59644 1 13.5C1 20.4036 6.59644 26 13.5 26ZM13.5 27C20.9558 27 27 20.9558 27 13.5C27 6.04416 20.9558 0 13.5 0C6.04416 0 0 6.04416 0 13.5C0 20.9558 6.04416 27 13.5 27ZM29.5 26C36.4036 26 42 20.4036 42 13.5C42 6.59644 36.4036 1 29.5 1C22.5964 1 17 6.59644 17 13.5C17 20.4036 22.5964 26 29.5 26ZM29.5 27C36.9558 27 43 20.9558 43 13.5C43 6.04416 36.9558 0 29.5 0C22.0442 0 16 6.04416 16 13.5C16 20.9558 22.0442 27 29.5 27Z" fill="#38E8A9"/>
    </SvgIcon>
);
