import * as React from 'react';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import {MUIDialog} from "../../../../web/js/ui/dialogs/MUIDialog";
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import {ColumnDescriptor, COLUMNS} from "./Columns";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import FilterListIcon from '@material-ui/icons/FilterList';
import Box from '@material-ui/core/Box';

interface IProps {
    readonly columns: ReadonlyArray<keyof IDocInfo>;
    readonly onAccept: (columns: ReadonlyArray<keyof IDocInfo>) => void;
}

export const DocColumnsSelector = (props: IProps) => {

    const [open, setOpen] = React.useState(false);

    const [columns, setColumns] = React.useState(props.columns);

    const handleToggleColumn = React.useCallback((column: ColumnDescriptor) => {
        if (columns.includes(column.id)) {
            setColumns(columns.filter(current => current !== column.id));
        } else {
            setColumns([...columns, column.id]);
        }
    }, [columns]);

    const toListItem = React.useCallback((column: ColumnDescriptor) => {
        return (
            <ListItem key={column.id}
                      button
                      onClick={() => handleToggleColumn(column)}>
                <Checkbox checked={columns.includes(column.id)} />
                <ListItemText primary={column.label} />
            </ListItem>
        )
    }, [columns, handleToggleColumn]);

    const handleAccept = React.useCallback(() => {
        setOpen(false);
        const newColumns = COLUMNS.filter(current => columns.includes(current.id))
                                  .map(current => current.id);
        props.onAccept(newColumns);
    }, [columns, props]);

    return (

        <>
            <Box mr={1}>
                <IconButton size="small"
                            onClick={() => setOpen(true)}>
                    <Box color="text.secondary">
                        <FilterListIcon style={{height: '0.8em'}}/>
                    </Box>
                </IconButton>
            </Box>

            {open && (
                <MUIDialog open={open} onClose={() => setOpen(false)}>

                    <DialogTitle>
                        Change Visible Document Metadata Columns
                    </DialogTitle>

                    <DialogContent>
                        <List style={{minWidth: '250px'}}>
                            {COLUMNS.map(toListItem)}
                        </List>
                    </DialogContent>

                    <DialogActions>

                        <Button onClick={() => setOpen(false)}
                                size="large">
                            Cancel
                        </Button>

                        <Button onClick={handleAccept}
                                size="large"
                                color="primary"
                                variant="contained">
                            Apply
                        </Button>

                    </DialogActions>

                </MUIDialog>)}
        </>
    );

}
