import * as React from 'react';
import useTheme from '@material-ui/core/styles/useTheme';

interface IProps {
    readonly className?: string;
    readonly disabled?: boolean;
    readonly onClick: (event: React.MouseEvent) => void;
    readonly children: JSX.Element;
}

export const NoteButton = React.memo(function NoteButton(props: IProps) {

    const [hover, setHover] = React.useState(false);
    const theme = useTheme();

    const backgroundColor = hover ? theme.palette.background.paper : 'inherit'

    const handleMouseEnter = React.useCallback(() => {

        if (props.disabled) {
            return;
        }

        setHover(true);

    }, [props.disabled]);

    const handleMouseLeave = React.useCallback(() => {

        if (props.disabled) {
            return;
        }

        setHover(false);

    }, [props.disabled]);

    const handleClick = React.useCallback((event: React.MouseEvent) => {

        if (props.disabled) {
            return;
        }

        props.onClick(event);

    }, [props]);

    return (
        <div onMouseEnter={handleMouseEnter}
             onMouseLeave={handleMouseLeave}
             onClick={handleClick}
             className={props.className}
             style={{
                 display: 'inline-block',
                 borderRadius: '1em',
                 backgroundColor,
                 width: '1em',
                 height: '1em',
                 lineHeight: '1em',
                 cursor: 'pointer',
                 userSelect: 'none'
             }}>
            <div style={{
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     lineHeight: '1em',
                     userSelect: 'none'
                 }}>

                {props.children}

            </div>
        </div>
    );
    
});