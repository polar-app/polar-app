import * as React from 'react';
import {ColorButton} from './ColorButton';
import Box from '@material-ui/core/Box';
import {deepMemo} from "../../react/ReactUtils";

interface ColorButtonsRowProps extends IProps {
    readonly colors: ReadonlyArray<string>;
}

const ColorButtonsRow = (props: ColorButtonsRowProps) => {

    const selected = props.selected || [];

    return <div style={{display: 'flex'}}>
        {props.colors.map(color =>
          <ColorButton key={color}
                       selected={selected.includes(color)}
                       onSelected={props.onSelected}
                       color={color}/>)}
    </div>;

};

const ColorButtonsRow0 = (props: IProps) => {

    const colors = ['yellow', 'red', 'green', '#9900EF', '#FF6900'];

    return <ColorButtonsRow {...props} colors={colors}/>;

};

const ColorButtonsRow1 = (props: IProps) => {

    const colors = ['#8DFF76', '#00D084', '#8ED1FC', '#0693E3', '#EB144C'];

    return <ColorButtonsRow {...props} colors={colors}/>;

};

const ColorButtonsRow2 = (props: IProps) => {
    const colors = ['#F78DA7', '#FFFF00', '#F96676', '#FCB900', '#7BDCB5'];

    return <ColorButtonsRow {...props} colors={colors}/>;

};

const ColorButtons = (props: IProps) => {

    return (
        <Box pt={1} pb={1}>

            <ColorButtonsRow0 {...props}/>

            <Box mt={1}>
                <ColorButtonsRow1 {...props}/>
            </Box>

            <Box mt={1}>
                <ColorButtonsRow2 {...props}/>
            </Box>

        </Box>
    );

};


interface IProps {
    readonly selected?: ReadonlyArray<ColorStr>;
    readonly onSelected?: (color: ColorStr) => void;
}

export const ColorSelectorBox = deepMemo(function ColorSelectorBox(props: IProps) {

    return (
        <div>
            <ColorButtons {...props}/>
        </div>
    );

});


export type ColorStr = string;

