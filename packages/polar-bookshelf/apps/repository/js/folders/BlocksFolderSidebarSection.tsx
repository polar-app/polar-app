import React from "react";
import AddIcon from '@material-ui/icons/Add';
import {Box, createStyles, Collapse, makeStyles} from "@material-ui/core";
import {CollapseIcon, ExpandIcon} from "../../../../web/js/mui/treeview/MUITreeIcons";
import {IconWithColor} from "../../../../web/js/ui/IconWithColor";

interface IProps {
    readonly label: string;
    readonly onAdd?: () => void;
}

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            '& svg': {
                fontSize: 18,
            },
        },
        button: {
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
        },
    })
);

export const BlocksFolderSidebarSection: React.FC<IProps> = (props) => {
    const { label, children, onAdd } = props;
    const [isOpen, setOpen] = React.useState(true);
    const classes = useStyles();

    const toggleOpen = React.useCallback(() => setOpen(open => ! open), [setOpen]);

    return (
        <>
            <Box className={classes.root}
                 display="flex"
                 alignItems="center"
                 justifyContent="space-between"
                 py={1}>

                <Box display="flex" alignItems="center">
                    <Box className={classes.button}>
                        {isOpen
                            ? <CollapseIcon nodeId="1" onNodeCollapse={toggleOpen} />
                            : <ExpandIcon nodeId="1" onNodeExpand={toggleOpen} />
                        }
                    </Box>
                    <Box ml={1} fontSize="1.1rem">
                        <b>{label}</b>
                    </Box>
                </Box>

                {onAdd && (
                    <div className={classes.button} onClick={onAdd}>
                        <IconWithColor color="text.secondary"
                                       Component={(props) => <AddIcon {...props} fontSize="small" />}/>
                    </div>
                )}
            </Box>
            <Collapse in={isOpen} timeout={75}>
                <Box ml="10px">
                    {children}
                </Box>
            </Collapse>
        </>
    );
};
