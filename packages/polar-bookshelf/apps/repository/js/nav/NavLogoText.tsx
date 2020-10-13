import * as React from "react";
import {deepMemo} from "../../../../web/js/react/ReactUtils";

export const NavLogoText = deepMemo(() => {
    return (
        <div style={{
                 paddingLeft: '5px',
                 paddingRight: '5px',
                 fontWeight: 700,
                 fontSize: '27px',
                 userSelect: 'none',
                 textDecoration: 'none'
             }}>
            POLAR
        </div>
    );

});
