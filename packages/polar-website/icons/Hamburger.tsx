import React, {type HTMLAttributes} from "react";
import {SvgIcon} from "styled/SvgIcon";

interface IProps extends HTMLAttributes<SVGSVGElement> {
    readonly style?: React.CSSProperties;
    readonly className?: string;
}

export const Hamburger: React.FC<IProps> = (props) => (
    <SvgIcon {...props} viewBox="0 0 34 19">
        <path d="M0 2H34" stroke="currentColor" strokeWidth="2.37209"/>
        <path d="M0 9.90625H34" stroke="currentColor" strokeWidth="2.37209"/>
        <path d="M0 17.8145H21.3488" stroke="currentColor" strokeWidth="2.37209"/>
    </SvgIcon>
);
