import React from "react";
import isEqual from "react-fast-compare";
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {Devices} from "polar-shared/src/util/Devices";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {RepositoryToolbar} from "../../../../web/js/apps/repository/RepositoryToolbar";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {MUIDocTagButton} from "../doc_repo/buttons/MUIDocTagButton";
import {NotesRepoTableHeadCheck} from "./NotesRepoTableHeadCheck";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: Devices.isDesktop() ? 'row-reverse': 'row',
        }
    }),
);

interface IProps {
    readonly className?: string;
}

export const SelectionActiveButtons = React.memo(function SelectionActiveButtons(props: IProps) {

    return (
        <MUIButtonBar className={props.className}>
            <>
                <MUIDocTagButton onClick={NULL_FUNCTION} size={Devices.isDesktop()?"medium":"small"}/>
            </>
        </MUIButtonBar>
    );
});

const NotesRepoTableToolbarMain =  React.memo(function NotesRepoTableToolbarMain() {

    // const {view, selected} = useDocRepoStore(['view', 'selected']);

    const selected = [];

    return (
        <>
            <DeviceRouter.Desktop>
                <div style={{display: 'flex',marginRight: 'auto'}}>
                    <NotesRepoTableHeadCheck/>

                    {selected.length > 0 && <SelectionActiveButtons/>}
                </div>
            </DeviceRouter.Desktop>
        </>
    );

});

export const NotesRepoTableToolbar = React.memo(function NotesRepoTableToolbar() {

    const classes = useStyles();

    return (
        <>
            <DeviceRouter.Desktop>
                <RepositoryToolbar className={classes.root}>
                    <NotesRepoTableToolbarMain/>
                </RepositoryToolbar>
            </DeviceRouter.Desktop>

            <DeviceRouter.Handheld>
                <AppBar color={"inherit"} position="static">
                    <Toolbar>
                        <NotesRepoTableToolbarMain/>
                    </Toolbar>
                </AppBar>
            </DeviceRouter.Handheld>
        </>
    );
}, isEqual);
