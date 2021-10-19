import * as React from 'react';
import {AppBar, Toolbar, Typography} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

interface IProps {
    readonly title: string;
}
/**
 * A header that will showcase a back button with a title
 */
export const HeaderBar = React.memo(function HeaderBar(props: IProps) {

    const history = useHistory();

    return(
        <AppBar position="sticky">
            <Toolbar>
                <IconButton onClick={()=>history.goBack()}>
                    <ArrowBackIcon/>
                </IconButton>
                <Typography component="h3">{props.title}</Typography>
            </Toolbar>
        </AppBar>
    );
});
