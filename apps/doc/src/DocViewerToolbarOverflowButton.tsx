import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {MUIMenu} from "../../../web/js/mui/menu/MUIMenu";
import {MUIMenuItem} from "../../../web/js/mui/menu/MUIMenuItem";
import {deepMemo} from "../../../web/js/react/ReactUtils";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {useLinkLoader} from "../../../web/js/ui/util/LinkLoaderHook";
import {Clipboards} from "../../../web/js/util/system/clipboard/Clipboards";

interface IProps {
    readonly docInfo: IDocInfo | undefined;
}

export const DocViewerToolbarOverflowButton = deepMemo((props: IProps) => {

    const linkLoader = useLinkLoader();

    return (
        <MUIMenu caret
                 placement="bottom-end"
                 button={{
                     icon: <MoreVertIcon/>,
                     size: 'small'
                 }}>

            <div>
                <MUIMenuItem text="Open original URL in browser"
                             disabled={! props.docInfo?.url}
                             onClick={() => linkLoader(props.docInfo?.url!, {focus: true, newWindow: true})}/>

                <MUIMenuItem text="Copy original URL to clipboard"
                             disabled={! props.docInfo?.url}
                             onClick={() => Clipboards.getInstance().writeText(props.docInfo?.url!)}/>
            </div>

        </MUIMenu>
    );

});
