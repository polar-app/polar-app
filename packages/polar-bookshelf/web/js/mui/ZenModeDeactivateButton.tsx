import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import { DeviceRouters } from "../ui/DeviceRouter";
import { useZenModeCallbacks } from "./ZenModeStore";
import {ZenModeInactiveContainer} from "./ZenModeInactiveContainer";
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(3),
            // color: theme.palette.text.secondary
        },
    }),
);

export function ZenModeDeactivateButton() {

    const classes = useStyles();
    const [tooltipActive, setTooltipActive] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);

    const {toggleZenMode} = useZenModeCallbacks();

    return (
        <ZenModeInactiveContainer>
            <DeviceRouters.Desktop>
                <>
                    <Tooltip open={tooltipActive && ! open}
                             placement="right"
                             title="Exit Zen Mode">
                        <Fab ref={anchorRef}
                             size="small"
                             variant="extended"
                             style={{
                                 zIndex: 1000
                             }}
                             aria-label="Exit Zen Mode"
                             onClick={toggleZenMode}
                             onMouseEnter={() => setTooltipActive(true)}
                             onMouseLeave={() => setTooltipActive(false)}
                             className={classes.root}>

                            <FullscreenExitIcon/>

                            {/*Exit Zen Mode*/}

                        </Fab>
                    </Tooltip>

                </>
            </DeviceRouters.Desktop>
        </ZenModeInactiveContainer>
    );
}
