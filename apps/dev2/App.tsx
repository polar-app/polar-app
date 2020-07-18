import React from 'react';
import {Content} from "./Content";
import {SearchBar} from "./SearchBar";

export const App = () => {
    return (
        <div style={{padding: '15px'}}>
            <SearchBar/>
            <Content/>
        </div>
    );
}
