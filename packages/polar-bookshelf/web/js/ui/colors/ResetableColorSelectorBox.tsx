import * as React from 'react';
import {ColorSelectorBox, ColorStr} from "./ColorSelectorBox";
import {deepMemo} from "../../react/ReactUtils";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

interface IProps {
    readonly selected?: ReadonlyArray<ColorStr>;
    readonly onSelected: (color: ColorStr) => void;
    readonly onReset: () => void;
}

export const ResetableColorSelectorBox = deepMemo(function ResetableColorSelectorBox(props: IProps) {

    return (
        <div>

            <ColorSelectorBox selected={props.selected}
                              onSelected={props.onSelected}/>

            <Box pb={1} style={{display: 'flex'}}>
                <Button onClick={props.onReset}
                        style={{
                            marginLeft: 'auto', marginRight: 'auto'
                        }}
                        variant="contained">Reset</Button>
            </Box>

        </div>
    );

});
