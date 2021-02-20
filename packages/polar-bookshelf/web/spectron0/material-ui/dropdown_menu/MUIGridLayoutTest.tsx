import React from 'react';
import {MUIGridLayout} from "../../../js/mui/MUIGridLayout";


const items = [
    <div key={0}>first</div>,
    <div key={1}>second</div>
];

export const MUIGridLayoutTest = () => {
    return (
        <MUIGridLayout items={items}/>
    );
};
