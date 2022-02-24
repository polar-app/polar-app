import React from "react";
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
import {UserAvatarIconButton} from "../../../../web/js/ui/cloud_auth/UserAvatarIconButton";
import {RoutePathNames} from "../../../../web/js/apps/repository/RoutePathNames";
import {useHistory} from "react-router-dom";
import {profiled} from "../../../../web/js/profiler/ProfiledComponents";
import {Box} from "@material-ui/core";
import {NotesToolbar} from "../../../../web/js/notes/NotesToolbar";

const useStyles = makeStyles(() =>
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
                <MUIDocTagButton onClick={NULL_FUNCTION} size={Devices.isDesktop() ? "medium" : "small"}/>
            </>
        </MUIButtonBar>
    );
});

const NotesRepoTableToolbarMain = React.memo(function NotesRepoTableToolbarMain() {

    // const {view, selected} = useDocRepoStore(['view', 'selected']);

    const selected = [];

    return (
        <DeviceRouter.Desktop>
            <Box display="flex" width="100%">
                <NotesRepoTableHeadCheck/>
                
                {selected.length > 0 && <SelectionActiveButtons/>}
            </Box>
        </DeviceRouter.Desktop>
    );

});

export const NotesRepoTableToolbar = React.memo(profiled(function NotesRepoTableToolbar() {

    const classes = useStyles();
    const history = useHistory();

    return (
        <>
            <DeviceRouter.Desktop>
                <>
                    <NotesToolbar />
                    <RepositoryToolbar className={classes.root}>
                        <NotesRepoTableToolbarMain/>
                    </RepositoryToolbar>
                </>
            </DeviceRouter.Desktop>

            <DeviceRouter.Handheld>
                <AppBar color={"inherit"} position="static">
                    <Toolbar>

                        <span>Notes</span>

                        <UserAvatarIconButton onClick={()=>history.push(RoutePathNames.ACCOUNT_MOBILE)}
                                              style={{marginLeft: 'auto'}}/>

                    </Toolbar>
                </AppBar>
            </DeviceRouter.Handheld>
        </>
    );
}));
