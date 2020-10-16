import React from 'react';
import Button from '@material-ui/core/Button';

interface IProps {
    readonly onClick: () => void;
}

export const LoginButton = React.memo((props: IProps) => (
    <Button id="enable-cloud-sync"
            color="primary"
            variant="contained"
            onClick={() => props.onClick()}>

        <span className="d-none-mobile">Login</span>

    </Button>
));
