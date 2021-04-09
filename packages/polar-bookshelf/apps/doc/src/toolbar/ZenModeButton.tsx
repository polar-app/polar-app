import * as React from "react";
import {StandardIconButton} from "../../../repository/js/doc_repo/buttons/StandardIconButton";
import {useZenModeCallbacks} from "../../../../web/js/mui/ZenModeStore";
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';

export const ZenModeButton = React.memo(function ZenModeButton() {

    const {toggleZenMode} = useZenModeCallbacks();

    return (
        <StandardIconButton tooltip="Zen mode"
                            onClick={toggleZenMode}>
            <ZoomOutMapIcon />
        </StandardIconButton>
    );

});
