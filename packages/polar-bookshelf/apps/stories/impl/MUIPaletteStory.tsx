import * as React from 'react';
import useTheme from '@material-ui/core/styles/useTheme';

interface IColorProps {
    readonly name: string;
    readonly value: string;
}

const Color = (props: IColorProps) => {
    return (

        <div style={{
                 display: 'flex',
                 alignItems: 'center',
                 margin: '5px'
             }}>

            <div style={{width: '200px'}}>
                {props.name}:
            </div>

            <div style={{
                     width: '300px',
                     height: '40px',
                     backgroundColor: props.value,
                     border: '5px',
                     padding: '5px'
                 }}>
                {props.value}
            </div>

        </div>
    )
}

export const MUIPaletteStory = React.memo(() => {

    const theme = useTheme();

    return (
        <div>
            <Color name='background.default' value={theme.palette.background.default}/>
            <Color name='background.paper' value={theme.palette.background.paper}/>

            <Color name='primary.main' value={theme.palette.primary.main}/>
            <Color name='primary.main' value={theme.palette.primary.main}/>
            <Color name='primary.light' value={theme.palette.primary.light}/>
            <Color name='primary.dark' value={theme.palette.primary.dark}/>
            <Color name='secondary.main' value={theme.palette.secondary.main}/>
            <Color name='secondary.light' value={theme.palette.secondary.light}/>
            <Color name='secondary.dark' value={theme.palette.secondary.dark}/>

            <Color name='text.primary' value={theme.palette.text.primary}/>
            <Color name='text.secondary' value={theme.palette.text.secondary}/>
            <Color name='text.hint' value={theme.palette.text.hint}/>
            <Color name='text.disabled' value={theme.palette.text.disabled}/>

        </div>
    );
})