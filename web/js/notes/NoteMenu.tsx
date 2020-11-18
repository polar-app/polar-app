import React from "react";
import {useNoteMenuSelectedListener, useNoteMenuSelectedStore} from "../../../apps/stories/impl/NotesStory";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import MenuList from "@material-ui/core/MenuList";

interface IProps {
    readonly top: number;
    readonly left: number;

}

export const NoteMenu = React.memo((props: IProps) => {

    const selectedMenuItem = useNoteMenuSelectedListener();
    const setSelectedMenuItem = useNoteMenuSelectedStore();

    interface NoteMenuItemProps {
        readonly text: string;
    }

    const NoteMenuItem = React.useCallback((props: NoteMenuItemProps) => {

        const id = props.text.toLowerCase().replace(/ /g, '-');

        return (
            <MenuItem onClick={() => setSelectedMenuItem(id)}
                      selected={selectedMenuItem === id}>
                <ListItemText primary={props.text} />
            </MenuItem>
        );
    }, [selectedMenuItem, setSelectedMenuItem]);

    return (

        <Paper elevation={3}
               style={{
                   position: 'absolute',
                   top: props.top,
                   left: props.left
               }}>

            <MenuList>
                <NoteMenuItem text="Embed"/>
                <NoteMenuItem text="Tomorrow"/>
                <NoteMenuItem text="Today"/>
                <NoteMenuItem text="Yesterday"/>
            </MenuList>
        </Paper>

    );
});
