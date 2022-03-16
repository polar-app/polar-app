import React, {type HTMLAttributes} from "react";
import styled from "@emotion/styled";

interface IProps extends HTMLAttributes<SVGSVGElement> {
    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly viewBox?: string;
}

const Svg = styled.svg`
    width: 1em;
    height: 1em;
    font-size: 3rem;
`;

export const SvgIcon: React.FC<IProps> = (props) => (
    <Svg {...props}
         fill="none"
         xmlns="http://www.w3.org/2000/svg" />
);
