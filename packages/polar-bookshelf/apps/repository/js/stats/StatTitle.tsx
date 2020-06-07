import * as React from 'react';
import Typography from '@material-ui/core/Typography';

interface IProps {
    readonly children: string;
}

export default function StatTitle(props: IProps) {

    return (

        <Typography align="center"
                    color="textPrimary"
                    variant="h4">

            {props.children}

        </Typography>

    );
}

