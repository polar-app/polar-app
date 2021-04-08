import React from 'react';
import {deepMemo} from "../../web/js/react/ReactUtils";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';


// sets up finder and context

interface INote {
    readonly id: string;
    readonly content: string
    readonly children?: ReadonlyArray<INote>;
}

const notes: ReadonlyArray<INote> = [
    {
        id: '101',
        content: 'first note',
    },
    {
        id: '102',
        content: 'this is the second note',
        children: [
            {
                id: '103',
                content: 'This is a child note'
            }
        ]
    }
]

interface NoteProps {
    readonly notes: ReadonlyArray<INote> | undefined;
}

const Notes = deepMemo(function Notes(props: NoteProps) {

    if ( ! props.notes) {
        return null;
    }

    return (
        <ul>

            {props.notes.map((note) => (
                <li key={note.id}>
                    {/*<CKEditor5 content={note.content}*/}
                    {/*           onChange={NULL_FUNCTION}/>*/}
                     <Notes notes={note.children}/>
                </li>))}

        </ul>

    );

});

export const App = () => {

    return (
        <>
            <Notes notes={notes}/>

            <Menu
                id="fade-menu"
                keepMounted
                open={true}
                style={{height: '100px'}}>
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
            </Menu>
        </>
    );

    // return (
    //     <ul>
    //
    //         {notes.map((note) => (
    //             <li key={note.id}>
    //                 <Editor content={note.content}
    //                         onChange={NULL_FUNCTION}/>
    //             </li>))}
    //
    //     </ul>
    //
    // );

}

