import * as React from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";

const ICON_STYLE: React.CSSProperties = {
    width: '20px'
};

export class StartReviewDropdown extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <UncontrolledDropdown size="sm"
                                  direction="down"
                                  id="start-review-dropdown">

                <DropdownToggle size="sm"
                                style={{fontWeight: 'bold'}}
                                color="success" caret>

                    <i className="fas fa-graduation-cap mr-1"/> Start Review

                </DropdownToggle>

                <DropdownMenu>

                    <DropdownItem size="sm"
                                  onClick={this.props.onReading}>
                        <i className="fas fa-book-reader" style={ICON_STYLE}/> Reading
                    </DropdownItem>


                    <DropdownItem size="sm"
                                  onClick={this.props.onFlashcards}>
                        <i className="fas fa-bolt" style={ICON_STYLE}/> Flashcards
                    </DropdownItem>

                </DropdownMenu>

            </UncontrolledDropdown>

        );

    }


}

export interface IProps {
    readonly onReading: () => void;
    readonly onFlashcards: () => void;
}

interface IState {

}
