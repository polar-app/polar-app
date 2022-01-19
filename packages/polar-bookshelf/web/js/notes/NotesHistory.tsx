import React from 'react';
import {Breadcrumbs} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

interface IHistoryEntry {
    readonly title: string;
    readonly path: string;
}

export interface NotesHistoryProps {

    readonly history: ReadonlyArray<IHistoryEntry>;

}

export const NotesHistory = (props: NotesHistoryProps) => {

    return (
        <Breadcrumbs aria-label="breadcrumb">
            {/*<Link color="inherit" href="/" onClick={handleClick}>*/}
            {/*    Material-UI*/}
            {/*</Link>*/}
            {/*<Link color="inherit" href="/getting-started/installation/" onClick={handleClick}>*/}
            {/*    Core*/}
            {/*</Link>*/}

            {props.history.map(current => (
                <div>{current.title}</div>
            ))}

            <Typography color="textPrimary">Breadcrumb</Typography>
        </Breadcrumbs>
    )

}
