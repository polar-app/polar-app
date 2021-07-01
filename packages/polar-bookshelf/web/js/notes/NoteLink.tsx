import * as React from 'react';
import {createNoteLink} from "./NoteLinkLoader";
import {Link} from "react-router-dom";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";

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
