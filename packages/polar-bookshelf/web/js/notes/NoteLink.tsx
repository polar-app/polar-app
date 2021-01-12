import * as React from 'react';
import {NoteIDStr} from "./store/NotesStore";
import {useNoteLink} from "./NoteLinkLoader";
import {Link} from "react-router-dom";

interface IProps {
    readonly target: NoteIDStr;
    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly children: JSX.Element | string;
}

export const NoteLink = React.memo((props: IProps) => {

    const noteLink = useNoteLink(props.target);

    return (
        <Link to={noteLink}
              className={props.className}
              style={props.style}>

            {props.children}

        </Link>
    );
});