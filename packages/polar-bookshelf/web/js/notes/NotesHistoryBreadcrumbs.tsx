import React from 'react';
import {Breadcrumbs, MenuItem, Popover} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import useTheme from "@material-ui/core/styles/useTheme";
import {useHistory} from "react-router-dom";
import {URLPathStr} from "polar-shared/src/util/Strings";

interface IHistoryEntry {
    readonly title: string;
    readonly path: string;
}

export interface NotesHistoryProps {

    readonly history: ReadonlyArray<IHistoryEntry>;

}

export function useNotesHistory() {

    const history = useHistory();

    const [notesHistory, setNotesHistory] = React.useState<ReadonlyArray<URLPathStr>>([])

    React.useEffect(() => {

        return history.listen((location, action) => {

            switch (action) {

                case 'PUSH':

                    function doPush() {
                        const result = [...notesHistory];
                        result.push(location.pathname);
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
                        result[result.length - 1] = location.pathname;
                        return result;
                    }

                    setNotesHistory(doReplace())

                    break;

            }

        });


    });

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
