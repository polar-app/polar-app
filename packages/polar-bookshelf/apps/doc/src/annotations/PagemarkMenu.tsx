import * as React from "react";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {MUIMenuItem} from "../../../../web/js/mui/menu/MUIMenuItem";
import {IPagemark} from "polar-shared/src/metadata/IPagemark";

export const PagemarkValueContext = React.createContext<IPagemark>(null!);

export function usePagemarkValueContext() {
    return React.useContext(PagemarkValueContext);
}

export const PagemarkMenu = () => {

    const pagemark = usePagemarkValueContext();

    return (
        <>
            <MUIMenuItem text="Delete Pagemark"
                         icon={<DeleteForeverIcon/>}
                         onClick={NULL_FUNCTION}/>

        </>
    );

}
