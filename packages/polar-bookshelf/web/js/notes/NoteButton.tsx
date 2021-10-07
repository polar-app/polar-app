import * as React from 'react';
import useTheme from '@material-ui/core/styles/useTheme';

interface IProps {
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly disabled?: boolean;
    readonly onClick: (event: React.MouseEvent) => void;
    readonly onMouseDown?: (event: React.MouseEvent) => void;
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
             onMouseDown={props.onMouseDown}
             onClick={handleClick}
             className={props.className}
             style={{
                 display: 'inline-block',
                 backgroundColor,
                 width: 20,
                 height: 28, // This has to match the line-height of the text contents of the block
                 cursor: 'pointer',
                 userSelect: 'none',
                 ...props.style,
             }}>
            <div style={{
                     height: '100%',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     userSelect: 'none',
                 }}>

                {props.children}

            </div>
        </div>
    );
    
});
