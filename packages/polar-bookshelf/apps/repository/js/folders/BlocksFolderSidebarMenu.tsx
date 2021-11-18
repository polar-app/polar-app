import {MUIMenuItem} from "../../../../web/js/mui/menu/MUIMenuItem";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import * as React from "react";
import {TagType} from "polar-shared/src/tags/Tags";
import {Strings} from "polar-shared/src/util/Strings";
import {useCreateBlockUserTagDialog} from "./BlocksFolderSidebar";

interface IProps {
    readonly type: TagType;
}

export const BlocksFolderSidebarMenu: React.FC<IProps> = (props) => {

    const { type } = props;
    const handleCreateUserTag = useCreateBlockUserTagDialog();
    /*
    const folderSidebarStore = useBlocksFolderSidebarStore();
    const handleRenameUserTag = useRenameBlockUserTagDialog();

    const { selected } = folderSidebarStore;

    const handleDelete = () => {
    };
    */

    return (
        <>
            <MUIMenuItem text={"Create " + Strings.upperFirst(type)}
                         icon={<LocalOfferIcon />}
                         onClick={handleCreateUserTag(type)} />

            {/*
            {selected.length === 1 && 
                <MUIMenuItem text={"Rename " + Strings.upperFirst(type)}
                             icon={<CreateIcon />}
                             onClick={handleRenameUserTag(type)} />
            }
            */}

            {/*
            <Divider/>

            <MUIMenuItem text="Delete"
                         icon={<DeleteForeverIcon/>}
                         onClick={handleDelete}/>
            */}
        </>
    );

}
