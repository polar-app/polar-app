import * as React from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";

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
                        <i className="fas fa-book-reader"/> Reading
                    </DropdownItem>


                    <DropdownItem size="sm"
                                  onClick={this.props.onFlashcards}>
                        <i className="fas fa-bolt"/> Flashcards
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
