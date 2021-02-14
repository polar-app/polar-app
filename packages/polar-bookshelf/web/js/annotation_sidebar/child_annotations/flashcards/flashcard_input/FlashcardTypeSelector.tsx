import * as React from 'react';
import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

export class FlashcardTypeSelector extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={this.props.flashcardType}
                // variant="outlined"
                onChange={event => this.props.onChangeFlashcardType(event.target.value as FlashcardType)}>
                <MenuItem value={FlashcardType.BASIC_FRONT_BACK}>Front and back</MenuItem>
                <MenuItem value={FlashcardType.CLOZE}>Cloze</MenuItem>
            </Select>

        );

    }

}

interface IProps {
    readonly flashcardType: FlashcardType;
    readonly onChangeFlashcardType: (flashcardType: FlashcardType) => void;
}

interface IState {
}
