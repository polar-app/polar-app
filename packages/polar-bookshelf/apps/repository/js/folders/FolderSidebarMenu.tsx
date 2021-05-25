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
    readonly disabled?: boolean;
}

export const FolderSidebarMenu = (props: IProps) => {

    const {onDelete, onCreateUserTag, onRenameUserTag} = useFolderSidebarCallbacks();

    const {selected} = useFolderSidebarStore(['selected']);

    const handleDelete = React.useCallback(() => {
        onDelete();
    }, [onDelete])

    const { disabled = false, type } = props;

    return (
        <>
            <MUIMenuItem text={"Create " + Strings.upperFirst(type)}
                         icon={<LocalOfferIcon/>}
                         onClick={() => onCreateUserTag(type)}/>

            {selected.length === 1 && 
                <MUIMenuItem text={"Rename " + Strings.upperFirst(type)}
                             icon={<CreateIcon/>}
                             disabled={disabled}
                             onClick={() => onRenameUserTag(type)}/>
            }
            <Divider/>

            <MUIMenuItem text="Delete"
                         icon={<DeleteForeverIcon/>}
                         disabled={disabled}
                         onClick={handleDelete}/>

        </>
    );

}
