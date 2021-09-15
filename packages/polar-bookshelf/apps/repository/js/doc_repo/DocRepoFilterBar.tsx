import * as React from 'react';
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";

export const DocRepoFilterBar = deepMemo(function DocRepoFilterBar() {

    return (

        <MUIButtonBar>
            <span style={{textAlign:'center'}}>Your workspace</span>
            {/* <MUISearchBox2 id="filter_title"
                           placeholder="Search by title"
                           initialValue={filters.title}
                           autoComplete="off"
                           onChange={text => setFilters({...filters, title: text})}/> */}
        </MUIButtonBar>
    );

});

