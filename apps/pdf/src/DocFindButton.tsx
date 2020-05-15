import * as React from "react";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';
import {useDocFindCallbacks} from "./DocFindStore";

export const DocFindButton = React.memo(() => {

    const {setActive} = useDocFindCallbacks();

    return (
        <IconButton onClick={() => setActive(true)}>
            <SearchIcon/>
        </IconButton>
    )

});
