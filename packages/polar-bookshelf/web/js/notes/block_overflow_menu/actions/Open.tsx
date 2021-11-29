import React from "react";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import {IBlockOverflowMenuActionProps} from "../BlockOverflowMenuPopper";
import {MUIMenuItem} from "../../../mui/menu/MUIMenuItem";
import {useHighlightBlockJumpToContext} from "../../AnnotationBlockUtils";

export const Open: React.FC<IBlockOverflowMenuActionProps> = (props) => {
    const { id } = props;
    const jumpToContext = useHighlightBlockJumpToContext();

    return <MUIMenuItem onClick={() => jumpToContext(id)}
                        icon={<OpenInNewIcon />}
                        text="Jump to context" />;
};
