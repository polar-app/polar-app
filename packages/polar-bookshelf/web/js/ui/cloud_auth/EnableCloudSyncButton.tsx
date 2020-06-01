/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import Button from '@material-ui/core/Button';

interface IProps {
    readonly onClick: () => void;
}

export function EnableCloudSyncButton(props: IProps) {

    return (
        <Button id="enable-cloud-sync"
                color="primary"
                variant="contained"
                onClick={() => props.onClick()}>

            <span className="d-none-mobile">Login</span>

        </Button>
    );

}
