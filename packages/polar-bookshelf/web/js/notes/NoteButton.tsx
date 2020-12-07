import * as React from 'react';
import useTheme from '@material-ui/core/styles/useTheme';

interface IProps {
    readonly className?: string;
    readonly onClick: (event: React.MouseEvent) => void;
    readonly children: JSX.Element;
}

export const NoteButton = React.memo(function NoteButton(props: IProps) {

    const [hover, setHover] = React.useState(false);
    const theme = useTheme();

    const backgroundColor = hover ? theme.palette.background.paper : 'inherit'

    return (
        <div onMouseEnter={() => setHover(true)}
             onMouseLeave={() => setHover(false)}
             onClick={props.onClick}
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