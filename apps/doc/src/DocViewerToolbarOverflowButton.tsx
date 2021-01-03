import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {MUIMenu} from "../../../web/js/mui/menu/MUIMenu";
import {MUIMenuItem} from "../../../web/js/mui/menu/MUIMenuItem";
import {deepMemo} from "../../../web/js/react/ReactUtils";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {useLinkLoader} from "../../../web/js/ui/util/LinkLoaderHook";
import {Clipboards} from "../../../web/js/util/system/clipboard/Clipboards";
import {SIDE_NAV_ENABLED, useSideNavCallbacks} from "../../../web/js/sidenav/SideNavStore";
import Divider from '@material-ui/core/Divider';

interface IProps {
    readonly docInfo: IDocInfo | undefined;
}

export const DocViewerToolbarOverflowButton = deepMemo((props: IProps) => {

    const linkLoader = useLinkLoader();

    const {closeCurrentTab} = useSideNavCallbacks();

    return (
        <MUIMenu caret
                 placement="bottom-end"
                 button={{
                     icon: <MoreVertIcon/>,
                     size: 'small'
                 }}>

            <div>
                <MUIMenuItem text="Open Original URL in Browser"
                             disabled={! props.docInfo?.url}
                             onClick={() => linkLoader(props.docInfo?.url!, {focus: true, newWindow: true})}/>

                <MUIMenuItem text="Copy Original URL to Clipboard"
                             disabled={! props.docInfo?.url}
                             onClick={() => Clipboards.writeText(props.docInfo?.url!)}/>

                <Divider/>

                {SIDE_NAV_ENABLED && (
                    <>
                        <MUIMenuItem text="Close Document"
                                     onClick={closeCurrentTab}/>
                    </>
                )}

            </div>

        </MUIMenu>
    );

});
