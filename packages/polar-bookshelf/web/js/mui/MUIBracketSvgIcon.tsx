import React from 'react';
import {SvgIcon, SvgIconProps} from "@material-ui/core";

export function MUIBracketSvgIcon(props: SvgIconProps) {
    // 575.91 x 575.91

    return (
        <SvgIcon viewBox="0 0 500 500"
                 {...props}>
            <path d="M144 32H32A32 32 0 0 0 0 64v384a32 32 0 0 0 32 32h112a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H64V96h80a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zm272 0H304a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h80v320h-80a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h112a32 32 0 0 0 32-32V64a32 32 0 0 0-32-32z"/>
        </SvgIcon>
    );
}
