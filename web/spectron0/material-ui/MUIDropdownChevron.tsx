/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';

class Styles {

    public static dropdownChevron: React.CSSProperties = {

        display: 'inline-block',
        width: 0,
        height: 0,
        marginLeft: '.255em',
        verticalAlign: '.255em',
        borderTop: '.3em solid',
        borderRight: '.3em solid transparent',
        borderBottom: 0,
        borderLeft: '.3em solid transparent',
        color: 'var(--secondary)'

    };

}

export const MUIDropdownChevron = () => (
    <span className="text-white" style={Styles.dropdownChevron}/>
);
