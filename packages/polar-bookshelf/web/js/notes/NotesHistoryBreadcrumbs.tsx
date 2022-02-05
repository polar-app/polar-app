import React from 'react';
import {Breadcrumbs, MenuItem, Popover} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import useTheme from "@material-ui/core/styles/useTheme";
import {useHistory} from "react-router-dom";
import {URLPathStr} from "polar-shared/src/util/Strings";
import {NoteURLs} from "./NoteURLs";

interface IHistoryEntry {
    readonly title: string;
    readonly path: string;
}

export interface NotesHistoryProps {

    readonly history: ReadonlyArray<IHistoryEntry>;

}

export function useNotesHistory() {

    const history = useHistory();

    const createHistoryEntry = React.useCallback((pathname: URLPathStr): IHistoryEntry => {

        const noteURL = NoteURLs.parse(pathname);

        return {
            title: noteURL.target,
            path: pathname
        };

    }, []);

    const initialHistory = React.useMemo(() => {

        return [
            createHistoryEntry(history.location.pathname)
        ];

    }, [createHistoryEntry, history]);

    const [notesHistory, setNotesHistory] = React.useState<ReadonlyArray<IHistoryEntry>>(initialHistory);

    const isNoteURL = React.useCallback((pathname: string) => {

        // return pathname.startsWith("/daily") || pathname.startsWith("/notes/");
        return pathname.startsWith("/notes/");

    }, []);

    React.useEffect(() => {

        return history.listen((location, action) => {

            if (isNoteURL(location.pathname)) {

                console.log(`FIXME action: ${action} with current history of: `, notesHistory);

                switch (action) {

                    case 'PUSH':

                        function doPush() {
                            const result = [...notesHistory];
                            result.push(createHistoryEntry(location.pathname));
                            return result;
                        }

                        setNotesHistory(doPush())

                        break;

                    case 'POP':

                        function doPop() {
                            const result = [...notesHistory];
                            result.pop();
                            return result;
                        }

                        setNotesHistory(doPop())
                        break;

                    case 'REPLACE':

                        function doReplace() {
                            const result = [...notesHistory];
                            result[result.length - 1] = createHistoryEntry(location.pathname);
                            return result;
                        }

                        setNotesHistory(doReplace())

                        break;

                }

            } else {

                console.log("FIXME: resetting notes history due to location: " + location.pathname)
                setNotesHistory([]);

            }

        });


    }, [createHistoryEntry, history, notesHistory, isNoteURL]);

    return notesHistory;

}

export const NotesHistoryBreadcrumbs = (props: NotesHistoryProps) => {

    const theme = useTheme()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (props.history.length === 0) {
        return null;
    }

    return (
        <>
            <Popover anchorEl={anchorEl}
                     keepMounted
                     open={anchorEl !== null}
                     anchorOrigin={{
                         vertical: 'bottom',
                         horizontal: 'left',
                     }}
                     transformOrigin={{
                         vertical: 'top',
                         horizontal: 'left',
                     }}
                     onClose={handleClose}>

                {props.history.slice(0, props.history.length - 1).map((current, idx) => (
                    <MenuItem key={idx} onClick={handleClose}>{current.title}</MenuItem>
                ))}

            </Popover>

            <Breadcrumbs separator="›" aria-label="breadcrumb">

                <div/>

                {props.history.length > 1 && (
                    <Button style={{
                                padding: 0,
                                minWidth: 0,
                                paddingLeft: '4px',
                                paddingRight: '4px',
                                backgroundColor: theme.palette.background.default,
                                color: theme.palette.text.secondary
                            }}
                            variant="contained"
                            size="small"
                            onClick={handleClick}>
                        <MoreHorizIcon/>
                    </Button>
                )}

                <Typography color="textPrimary">{props.history[props.history.length - 1].title}</Typography>

            </Breadcrumbs>

        </>
    )

}

export const NotesHistoryBreadcrumbsUsingHistory = () => {
    const notesHistory = useNotesHistory();

    return (
        <NotesHistoryBreadcrumbs history={notesHistory}/>
    )
}
