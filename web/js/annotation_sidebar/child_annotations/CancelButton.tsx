import * as React from 'react';
import Button from '@material-ui/core/Button';

interface IProps {
    readonly onClick: () => void;
}

export const CancelButton = React.memo(function CancelButton(props: IProps) {

    return (
        <Button onClick={props.onClick}>
            Cancel
        </Button>
    );

});
