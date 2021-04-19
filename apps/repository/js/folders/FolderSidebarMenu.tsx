import {MUIMenuItem} from "../../../../web/js/mui/menu/MUIMenuItem";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import Divider from "@material-ui/core/Divider";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CreateIcon from "@material-ui/icons/Create";
import * as React from "react";
import {TagType} from "polar-shared/src/tags/Tags";
import {Strings} from "polar-shared/src/util/Strings";
import {useFolderSidebarCallbacks, useFolderSidebarStore} from "../folder_sidebar/FolderSidebarStore";

interface IProps {
    readonly type: TagType;
}

export const FolderSidebarMenu = (props: IProps) => {

    const {onDelete, onCreateUserTag, onRenameUserTag} = useFolderSidebarCallbacks();

    const {selected} = useFolderSidebarStore(['selected']);

    const handleDelete = React.useCallback(() => {
        onDelete();
    }, [onDelete])

    return (
        <>
            <MUIMenuItem text={"Create " + Strings.upperFirst(props.type)}
                         icon={<LocalOfferIcon/>}
                         onClick={() => onCreateUserTag(props.type)}/>

            {selected.length === 1 && 
                <MUIMenuItem text={"Rename " + Strings.upperFirst(props.type)}
                             icon={<CreateIcon/>}
                             onClick={() => onRenameUserTag(props.type)}/>
            }
            <Divider/>

            <MUIMenuItem text="Delete"
                         icon={<DeleteForeverIcon/>}
                         onClick={handleDelete}/>

        </>
    );

}
