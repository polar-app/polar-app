import * as React from 'react';
import {MUISearchBox2} from "../../../../../web/spectron0/material-ui/MUISearchBox2";

interface IProps {
    readonly onChange: (text: string) => void;
}

export const TextFilter2 = (props: IProps) => {

    const width = '250px';

    return (

        <MUISearchBox2 id="filter_title"
                       placeholder="Filter by text"
                       style={{width}}
                       onChange={text => props.onChange(text)}/>


    );

}
