import React from "react";
import Divider from "@material-ui/core/Divider";
import {useDocRepoCallbacks, useDocRepoStore} from "./DocRepoStore2";
import isEqual from "react-fast-compare";
import {MUIDocTagButton} from "./buttons/MUIDocTagButton";
import {MUIDocArchiveButton} from "./buttons/MUIDocArchiveButton";
import {MUIDocFlagButton} from "./buttons/MUIDocFlagButton";
import {MUIDocDeleteButton} from "./buttons/MUIDocDeleteButton";
import {DocRepoFilterBar} from "./DocRepoFilterBar";
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {ChromeExtensionInstallBar} from "../ChromeExtensionInstallBar";
// import {SidenavTriggerIconButton} from "../../../../web/js/sidenav/SidenavTriggerIconButton";
import {Devices} from "polar-shared/src/util/Devices";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: Devices.isDesktop() ? 'row-reverse': 'row',
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingRight: theme.spacing(1),
        }
    }),
);

interface IProps {
    readonly className?: string;
}

export const SelectionActiveButtons = React.memo(function SelectionActiveButtons(props: IProps) {
    const callbacks = useDocRepoCallbacks();

    return (
        <MUIButtonBar className={props.className}>
            <>
                <MUIDocTagButton onClick={callbacks.onTagged} size={Devices.isDesktop()?"medium":"small"}/>
                <MUIDocArchiveButton onClick={callbacks.onArchived} size={Devices.isDesktop()?"medium":"small"}/>
                <MUIDocFlagButton onClick={callbacks.onFlagged} size={Devices.isDesktop()?"medium":"small"}/>
                <Divider orientation="vertical" variant="middle" flexItem/>

                <MUIDocDeleteButton size={Devices.isDesktop()?"medium":"small"}
                                    onClick={callbacks.onDeleted}/>
            </>
        </MUIButtonBar>
    );
});

const DocRepoTableToolbarMain =  React.memo(function DocRepoTableToolbarMain() {
    const {selected} = useDocRepoStore(['selected']);

    return (

        <>
            {/* <SidenavTriggerIconButton/> */}

            <DeviceRouter.Desktop>
                <ChromeExtensionInstallBar/>
            </DeviceRouter.Desktop>

            <div style={{ display: 'flex' }}>
                {Devices.isDesktop() && selected.length > 0 && <SelectionActiveButtons/> }
            </div>

            <DocRepoFilterBar/>
        </>
    );

});

export const DocRepoTableToolbar = React.memo(function DocRepoTableToolbar() {

    const classes = useStyles();

    return (
        <>

            <DeviceRouter.Desktop>
                <Paper square className={classes.root}>
                    <DocRepoTableToolbarMain/>
                </Paper>
            </DeviceRouter.Desktop>

            <DeviceRouter.Handheld>
                <AppBar color={"inherit"} position="static">
                    <Toolbar>
                        <DocRepoTableToolbarMain/>
                    </Toolbar>

                </AppBar>
            </DeviceRouter.Handheld>

        </>
    );
}, isEqual);
