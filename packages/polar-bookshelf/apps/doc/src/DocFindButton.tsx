import * as React from "react";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';
import {useDocFindCallbacks} from "./DocFindStore";

interface IProps {
    readonly className?: string;
}

export const DocFindButton = React.memo((props: IProps) => {

    const {setActive} = useDocFindCallbacks();

    return (
        <IconButton className={props.className}
                    onClick={() => setActive(true)}>
            <SearchIcon/>
        </IconButton>
    )

});
