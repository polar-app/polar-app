import * as React from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";
import {Link} from "react-router-dom";

const ICON_STYLE: React.CSSProperties = {
    width: '20px'
};

export class StartReviewDropdown extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <UncontrolledDropdown size="md"
                                  direction="down"
                                  id="start-review-dropdown">

                <DropdownToggle size="md"
                                style={{fontWeight: 'bold'}}
                                color="success" caret>

                    <i className="fas fa-graduation-cap mr-1"/> Start Review

                </DropdownToggle>

                <DropdownMenu>

                    <Link to={{pathname: '/annotations', hash: '#review-reading'}} className="no-underline">

                        <DropdownItem size="sm"
                                      style={{width: '100%'}}>
                            <i className="fas fa-book-reader" style={ICON_STYLE}/> Reading
                        </DropdownItem>

                    </Link>

                    <Link to={{pathname: '/annotations', hash: '#review-flashcards'}} className="no-underline">
                        <DropdownItem size="sm"
                                      style={{width: '100%'}}
                                      onClick={this.props.onFlashcards}>
                            <i className="fas fa-bolt" style={ICON_STYLE}/> Flashcards
                        </DropdownItem>
                    </Link>

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
