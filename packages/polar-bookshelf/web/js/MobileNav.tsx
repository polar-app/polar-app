import {ButtonBase, createStyles, makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import AppsIcon from "@material-ui/icons/Apps";
import React from "react";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            background: theme.palette.primary.main,
            height: 48,
            maxHeight: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            flex: '1 0 48px',
            '& a, & a:hover': {
                color: '#FFF'
            },
            '& .MuiSvgIcon-root': {
                width: 28,
                height: 28,
                display: 'block',
            },
            '& .MuiButtonBase-root': {
                borderRadius: '50%',
                padding: 4,
            }
        }
    }),
);

export const MobileNav: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <ButtonBase>
                <Link to="/"><HomeIcon /></Link>
            </ButtonBase>
            <ButtonBase>
                <SearchIcon />
            </ButtonBase>
            <ButtonBase>
                <AddIcon />
            </ButtonBase>
            <ButtonBase>
                <AppsIcon />
            </ButtonBase>
        </div>
    );
};
