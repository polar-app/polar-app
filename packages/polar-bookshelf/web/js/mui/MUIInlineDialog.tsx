import React from 'react';
import Paper from '@material-ui/core/Paper';

interface IProps {
    readonly children: JSX.Element;
}

export const MUIInlineDialog = React.memo(function MUIInlineDialog(props: IProps) {

    return (
        <div style={{
                 display: 'flex',
                 width: '100%',
                 height: '100%'
             }}>

            <Paper style={{
                        margin: 'auto',
                        maxWidth: '450px',
                        maxHeight: '500px',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>

                {props.children}

            </Paper>

        </div>
    );
});
