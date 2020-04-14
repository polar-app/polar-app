import * as React from "react";
import {VariableSizeList} from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

// These row heights are arbitrary.
// Yours should be based on the content of the row.
const rowHeights = new Array(1000)
    .fill(true)
    .map(() => 25 + Math.round(Math.random() * 50));

const getItemSize = (index: number) => {
    const id = 'row:' + index;
    console.log(`FIXME: checking if it exists: ${id}` , document.getElementById(id))
    return rowHeights[index];
};

interface RowProps {
    readonly index: number;
    readonly style: React.CSSProperties;
}

const Row = (props: RowProps) => (
    <div style={props.style} id={'row:' + props.index}>Row {props.index}</div>
);

export const ReactWindowDemo = () => (

    <AutoSizer>
        {size => (
            <VariableSizeList
                height={size.height}
                itemCount={1000}
                itemSize={getItemSize}
                width={size.width}
            >
                {Row}
            </VariableSizeList>
        )}
    </AutoSizer>
);


