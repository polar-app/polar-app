import * as React from "react";
import {useDocViewerCallbacks} from "./DocViewerStore";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';

export const DocFindButton = React.memo(() => {

    const {setFindActive} = useDocViewerCallbacks();

    return (
        <IconButton onClick={() => setFindActive(true)}>
            <SearchIcon/>
        </IconButton>
    )

});
