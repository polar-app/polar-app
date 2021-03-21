import * as React from "react";
import {deepMemo} from "../../../../web/js/react/ReactUtils";

interface IProps {
    readonly style?: React.CSSProperties;
}

export const PolarLogoText = deepMemo((props: IProps) => {
    return (
        <div style={{
                 paddingLeft: '5px',
                 paddingRight: '5px',
                 fontWeight: 700,
                 fontSize: '27px',
                 userSelect: 'none',
                 textDecoration: 'none',
                 ...props.style
             }}>
            POLAR
        </div>
    );

});
