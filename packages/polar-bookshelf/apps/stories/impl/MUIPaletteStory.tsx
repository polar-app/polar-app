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
            </div>

            <div style={{
                     width: '250px',
                     height: '40px',
                     border: '5px',
                     padding: '5px'
                 }}>
                {props.value}
            </div>

        </div>
    )
}

export const MUIPaletteStory = React.memo(function MUIPaletteStory() {

    const theme = useTheme();

    return (
        <div>
            <Color name='background.default' value={theme.palette.background.default}/>
            <Color name='background.paper' value={theme.palette.background.paper}/>

            <Color name='primary.main' value={theme.palette.primary.main}/>
            <Color name='primary.contrastText' value={theme.palette.primary.contrastText}/>
            <Color name='primary.light' value={theme.palette.primary.light}/>
            <Color name='primary.dark' value={theme.palette.primary.dark}/>

            <Color name='secondary.main' value={theme.palette.secondary.main}/>
            <Color name='secondary.contrastText' value={theme.palette.secondary.contrastText}/>
            <Color name='secondary.light' value={theme.palette.secondary.light}/>
            <Color name='secondary.dark' value={theme.palette.secondary.dark}/>

            <Color name='divider' value={theme.palette.divider}/>

            <Color name='error.main' value={theme.palette.error.main}/>
            <Color name='error.contrastText' value={theme.palette.error.contrastText}/>
            <Color name='error.light' value={theme.palette.error.light}/>
            <Color name='error.dark' value={theme.palette.error.dark}/>

            <Color name='info.main' value={theme.palette.info.main}/>
            <Color name='info.contrastText' value={theme.palette.info.contrastText}/>
            <Color name='info.light' value={theme.palette.info.light}/>
            <Color name='info.dark' value={theme.palette.info.dark}/>


            <Color name='warning.main' value={theme.palette.warning.main}/>
            <Color name='warning.contrastText' value={theme.palette.warning.contrastText}/>
            <Color name='warning.light' value={theme.palette.warning.light}/>
            <Color name='warning.dark' value={theme.palette.warning.dark}/>

            <Color name='success.main' value={theme.palette.success.main}/>
            <Color name='success.contrastText' value={theme.palette.success.contrastText}/>
            <Color name='success.light' value={theme.palette.success.light}/>
            <Color name='success.dark' value={theme.palette.success.dark}/>

            <Color name='text.primary' value={theme.palette.text.primary}/>
            <Color name='text.secondary' value={theme.palette.text.secondary}/>
            <Color name='text.hint' value={theme.palette.text.hint}/>
            <Color name='text.disabled' value={theme.palette.text.disabled}/>

        </div>
    );
})
