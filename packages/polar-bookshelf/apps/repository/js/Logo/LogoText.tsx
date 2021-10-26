import React from 'react';
import {Box, Divider, Typography} from '@material-ui/core';
import {PolarSVGIcon} from "../../../../web/js/ui/svg_icons/PolarSVGIcon";

export const LogoAndTextSideBySide = () => {
    return (
        <div>
            <div style={{display: 'flex'}}>
                <div style={{marginRight: 'auto', marginLeft: 'auto', display: 'flex', alignItems: "center"}}>
                    <Box m={1}>
                        <PolarSVGIcon width={100} height={100}/>
                    </Box>
                    <Box m={1}>
                        <Typography variant="h2" component="div">
                            POLAR
                        </Typography>
                    </Box>
                </div>
            </div>
        </div>
    )
}