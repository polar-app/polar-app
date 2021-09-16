import React from "react";
import Divider from "@material-ui/core/Divider";
import {useDocRepoCallbacks, useDocRepoStore} from "./DocRepoStore2";
import isEqual from "react-fast-compare";
import { MUIDocTagButton } from "./buttons/MUIDocTagButton";
import {MUIDocArchiveButton} from "./buttons/MUIDocArchiveButton";
import { MUIDocFlagButton } from "./buttons/MUIDocFlagButton";
import { MUIDocDeleteButton } from "./buttons/MUIDocDeleteButton";
import {DocRepoFilterBar} from "./DocRepoFilterBar";
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {ChromeExtensionInstallBar} from "../ChromeExtensionInstallBar";
import {SidenavTrigger} from "../../../../web/js/sidenav/SidenavTrigger";
import {Devices} from "polar-shared/src/util/Devices";
import { PolarSVGIcon } from "polar-bookshelf/web/js/ui/svg_icons/PolarSVGIcon";
import { Link } from "react-router-dom";
import { RoutePathnames } from "polar-bookshelf/web/js/apps/repository/RoutePathnames";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingRight: theme.spacing(1),
        },
        brand:{
            marginLeft: '10px'
        }
    }),
);

export const SelectionActiveButtons = React.memo(function SelectionActiveButtons() {
    const callbacks = useDocRepoCallbacks();

    return (
        <MUIButtonBar>
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

export const DocRepoTableToolbar = React.memo(function DocRepoTableToolbar() {

    const {selected}
        = useDocRepoStore(['selected']);

    const classes = useStyles();

    return (
        <Paper square
               className={classes.root}>

                {Devices.isDesktop() ? 
                    <SidenavTrigger/> 
                    : 
                    <Link to={RoutePathnames.HOME}>
                        <PolarSVGIcon className={classes.brand} width={50} height={50}/>
                    </Link>
                }
                
                <div style={{ display: 'flex' }}>
                    {Devices.isDesktop() && selected.length > 0 && <SelectionActiveButtons/> }
                </div>

                <ChromeExtensionInstallBar/>

            {/*always show the filter bar for desktop*/}
            {Devices.isDesktop() && <DocRepoFilterBar />}
            {/*on mobile, don't show if some rows are checked*/}
            {!Devices.isDesktop() && <DocRepoFilterBar />}

        </Paper>
    );
}, isEqual);
