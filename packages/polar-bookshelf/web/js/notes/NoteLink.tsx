import * as React from 'react';
import {BlockIDStr} from "./store/BlocksStore";
import {createNoteLink} from "./NoteLinkLoader";
import {Link} from "react-router-dom";

interface IProps {
    readonly target: BlockIDStr;
    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly children: JSX.Element | string;
    readonly draggable?: boolean;
}

export const NoteLink = React.memo(function NoteLink(props: IProps) {

    const noteLink = createNoteLink(props.target);

    return (
        <Link to={noteLink}
              draggable={props.draggable}
              className={props.className}
              style={props.style}>

            {props.children}

        </Link>
    );
});
