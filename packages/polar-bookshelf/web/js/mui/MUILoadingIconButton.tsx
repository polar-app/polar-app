import * as React from "react";
import IconButton from '@material-ui/core/IconButton/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

interface MUILoadingIconButtonProps {
    readonly icon: JSX.Element;
    readonly disabled?: boolean;
    readonly onClick: () => Promise<any>;
    readonly onDone: () => void;
    readonly onError: (err: Error) => void;
}

export const MUILoadingIconButton = (props: MUILoadingIconButtonProps) => {

    const [state, setState] = React.useState<'none' |  'loading' | 'done'>('none');

    const handleClick = React.useCallback(() => {

        setState('loading');

        props.onClick()
            .then(() => props.onDone())
            .catch(err => props.onError(err))
            .finally(() => setState('done'))

    }, [])

    if (props.disabled || state === 'done') {
        return (
            <IconButton disabled={true}>
                {props.icon}
            </IconButton>
        )
    }

    if (state === 'loading') {
        return (
            <IconButton>
                <CircularProgress size={25}/>
            </IconButton>
        );
    }

    return (

        <IconButton onClick={() => handleClick()} >
            {props.icon}
        </IconButton>
    );

}