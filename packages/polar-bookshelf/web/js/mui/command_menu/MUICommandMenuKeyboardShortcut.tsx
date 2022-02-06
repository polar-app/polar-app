import * as React from "react";
import {CommandsProvider, ICommand, MUICommandMenu} from "./MUICommandMenu";
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../../keyboard_shortcuts/GlobalKeyboardShortcuts";
import {MUIDialog} from "../../ui/dialogs/MUIDialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {Devices} from "polar-shared/src/util/Devices";
import {GenericInputEvent, KeyBinding} from "../../keyboard_shortcuts/KeyboardShortcutsStore";

const useStyles = makeStyles(() =>
    createStyles({
        dialog: {
            fontSize: '1.3rem',
        },
        commandMenu: {
            fontSize: '1.3rem',
            minHeight: 'min(80vh, 500px)',
            maxHeight: 'min(80vh, 500px)',
            minWidth: 'min(80vw, 700px)',
            maxWidth: 'min(80vw, 700px)',
        },
    }),
);

interface IProps<C extends ICommand> {
    readonly group: string;
    readonly name: string;
    readonly description: string;
    readonly sequences: ReadonlyArray<KeyBinding>;
    readonly commandsProvider: CommandsProvider<C>;
    readonly onCommand: (command: C, event: GenericInputEvent) => void;

    /**
     * When true, we enable icons to the left. This way we require every action
     * to have an icon but only if enabled.
     */
    readonly enableIcons?: boolean;

}

export const MUICommandMenuKeyboardShortcut = <C extends ICommand>(props: IProps<C>) => {

    const classes = useStyles();

    const [active, setActive] = React.useState(false);

    const globalKeyMap = React.useMemo(() => {
        return keyMapWithGroup(
            {
                group: props.group,
                keyMap: {
                    ACTIVATE: {
                        name: props.name,
                        description: props.description,
                        sequences: props.sequences,
                    },
                }
            });
    }, [props.description, props.group, props.name, props.sequences])

    const globalKeyHandlers = {
        ACTIVATE: () => setActive(true),
    };

    if (! Devices.isDesktop()) {
        // only activate on desktop.
        return null;
    }

    return (
        <>

            <GlobalKeyboardShortcuts keyMap={globalKeyMap}
                                     handlerMap={globalKeyHandlers}/>

            <MUIDialog open={active}
                       className={classes.dialog}
                       maxWidth="md">

                <MUICommandMenu<C> onCommand={props.onCommand}
                                   title={props.name}
                                   className={classes.commandMenu}
                                   onClose={() => setActive(false)}
                                   enableIcons={props.enableIcons}
                                   commandsProvider={props.commandsProvider}/>

            </MUIDialog>

        </>
    );

}
