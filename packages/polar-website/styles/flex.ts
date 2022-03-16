import {css} from "@emotion/react";

interface IOpts {
    dir?: 'row' | 'column';
    align?: 'flex-start' | 'flex-end' | 'center';
    justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
}

export const flex = ({ align, dir, justify }: IOpts = {}) => css`
    display: flex;
    ${dir ? `flex-direction: ${dir};` : ""}
    ${align ? `align-items: ${align};` : ""}
    ${justify ? `justify-content: ${justify};` : ""}
`;
