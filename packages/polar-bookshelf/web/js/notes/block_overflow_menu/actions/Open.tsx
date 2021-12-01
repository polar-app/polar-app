import React from "react";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import {IBlockOverflowMenuActionProps} from "../BlockOverflowMenuPopper";
import {MUIMenuItem} from "../../../mui/menu/MUIMenuItem";
import {useHighlightBlockJumpToContext} from "../../AnnotationBlockUtils";
import {useBlockOverflowMenuStore} from "../BlockOverflowMenu";

export const Open: React.FC<IBlockOverflowMenuActionProps> = (props) => {
    const { id } = props;
    const jumpToContext = useHighlightBlockJumpToContext();
    const blockOverflowMenuStore = useBlockOverflowMenuStore();

    const handleClick = React.useCallback(() => {
        jumpToContext(id);
        blockOverflowMenuStore.clearState();
    }, [id, blockOverflowMenuStore, jumpToContext]);

    return <MUIMenuItem onClick={handleClick}
                        icon={<OpenInNewIcon />}
                        text="Jump to context" />;
};
