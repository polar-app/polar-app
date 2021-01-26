import * as React from "react";
import {ICommand, MUICommandMenu} from "../mui/command_menu/MUICommandMenu";
import {TabDescriptor, useSideNavCallbacks, useSideNavStore} from "./SideNavStore";
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../keyboard_shortcuts/GlobalKeyboardShortcuts";
import {MUIDialog} from "../ui/dialogs/MUIDialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

const useStyles = makeStyles((theme) =>
    createStyles({
        dialog: {
            fontSize: '1.3rem',
        },
        commandMenu: {
            fontSize: '1.3rem',
            minHeight: 'min(80vh, 400px)',
            maxHeight: 'min(80vh, 400px)',
            minWidth: 'min(80vw, 600px)',
            maxWidth: 'min(80vw, 600px)',
            margin: theme.spacing(1)
        },
    }),
);

const globalKeyMap = keyMapWithGroup(
    {
        group: "Documents",
        keyMap: {
            ACTIVATE: {
                name: "Jump to Recent Document",
                description: "Filter and jump to a recent document",
                sequences: ['shift+command+e', 'shift+ctrl+e'],
            },
        }
    });

export const SideNavCommandMenu = () => {

    const classes = useStyles();
    const {tabs} = useSideNavStore(['tabs']);
    const {setActiveTab} = useSideNavCallbacks();

    const [active, setActive] = React.useState(false);

    const commandsProvider = React.useCallback(() => {

        function toCommand(tab: TabDescriptor): ICommand {
            return {
                id: `${tab.id}`,
                text: tab.title
            }
        }

        return arrayStream(tabs).sort((a,b) => a.lastActivated.localeCompare(b.lastActivated))
                                .reverse()
                                .map(toCommand)
                                .collect();

    }, [tabs]);

    const globalKeyHandlers = {
        ACTIVATE: () => setActive(true),
    };

    const handleCommand = React.useCallback((command: ICommand) => {
        setActiveTab(parseInt(command.id));
    }, [setActiveTab]);

    return (
        <>

            <GlobalKeyboardShortcuts keyMap={globalKeyMap}
                                     handlerMap={globalKeyHandlers}/>

            <MUIDialog open={active}
                       className={classes.dialog}
                       maxWidth="md">

                <MUICommandMenu onCommand={handleCommand}
                                title="Recent Documents"
                                className={classes.commandMenu}
                                onClose={() => setActive(false)}
                                commandsProvider={commandsProvider}/>

            </MUIDialog>

        </>
    );

}
