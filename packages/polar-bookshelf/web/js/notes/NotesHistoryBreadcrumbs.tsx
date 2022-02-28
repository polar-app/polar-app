import React from 'react';
import {Breadcrumbs, createStyles, makeStyles, MenuItem, Popover} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {useHistory} from "react-router-dom";
import {URLPathStr} from "polar-shared/src/util/Strings";
import {NoteURLs} from "./NoteURLs";
import {MUIBreadcrumbsOverflowIconButton} from '../mui/MUIBreadcrumbsOverflowIconButton';
import {MUITopBarTitle} from '../mui/MUITopBarTitle';

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

                setNotesHistory([]);

            }

        });


    }, [createHistoryEntry, history, notesHistory, isNoteURL]);

    return notesHistory;

}

const useStyles = makeStyles((theme) =>
    createStyles({
        breadcrumbsOuter: {
            minWidth: 0,
        },
        breadcrumbsInner: {
            flexWrap: 'nowrap',
        },
        breadcrumb: {
            '&:last-child': {
                minWidth: 0,
            },
        },
        popup: {
            background: theme.palette.background.default,
        },
    }),
);

export const NotesHistoryBreadcrumbs = (props: NotesHistoryProps) => {

    const history = useHistory();
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handlePopoverClose = React.useCallback(() => {
        setAnchorEl(null);
    }, []);

    const goBackToHistoryEntry = React.useCallback((delta: number) => {

        console.log("Going to delta: " + delta);

        history.go(delta);

        handlePopoverClose();

    }, [history, handlePopoverClose]);

    if (props.history.length === 0) {

        if (history.location.pathname === '/daily') {

            return (
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                    <div/>
                    <Typography color="textPrimary">Daily Notes</Typography>

                </Breadcrumbs>
            );

        }

        return null;
    }

    return (
        <>
            <Popover anchorEl={anchorEl}
                     keepMounted
                     classes={{ paper: classes.popup }}
                     open={anchorEl !== null}
                     anchorOrigin={{
                         vertical: 'bottom',
                         horizontal: 'left',
                     }}
                     transformOrigin={{
                         vertical: 'top',
                         horizontal: 'left',
                     }}
                     onClose={handlePopoverClose}>

                {props.history.slice(0, props.history.length - 1).map((current, idx) => (
                    <MenuItem key={idx}
                              onClick={() => goBackToHistoryEntry((props.history.length - idx - 1) * -1)}>
                        {current.title}
                    </MenuItem>
                ))}

            </Popover>

            <Breadcrumbs classes={{
                            root: classes.breadcrumbsOuter,
                            ol: classes.breadcrumbsInner,
                            li: classes.breadcrumb
                         }}
                         separator="›"
                         aria-label="breadcrumb">

                <div/>

                {props.history.length > 1 && (
                    <MUIBreadcrumbsOverflowIconButton onClick={handleClick} active={!! anchorEl} />
                )}
                

                <MUITopBarTitle>
                    {props.history[props.history.length - 1].title}
                </MUITopBarTitle>

            </Breadcrumbs>

        </>
    );

}

export const NotesHistoryBreadcrumbsUsingHistory = () => {
    const notesHistory = useNotesHistory();

    return (
        <NotesHistoryBreadcrumbs history={notesHistory}/>
    );
}
