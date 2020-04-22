import * as React from 'react';
import {MUIDropdownMenu} from "../../../../../web/spectron0/material-ui/dropdown_menu/MUIDropdownMenu";
import RateReviewIcon from '@material-ui/icons/RateReview';
import {MUIRouterLink} from "../../../../../web/spectron0/material-ui/MUIRouterLink";
import {MUIDropdownItem} from "../../../../../web/spectron0/material-ui/dropdown_menu/MUIDropdownItem";
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import FlashOnIcon from '@material-ui/icons/FlashOn';

export interface IProps {
    readonly onReading: () => void;
    readonly onFlashcards: () => void;
}

interface IState {

}

// TODO: move to functional component
export class StartReviewDropdown extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (
            <MUIDropdownMenu id="start-review-dropdown"
                             button={{
                                color: "primary",
                                text: 'Start Review',
                                size: 'large',
                                icon: <RateReviewIcon/>
                             }}
                             caret>
                <div>

                    <MUIRouterLink to={{pathname: '/annotations', hash: '#review-reading'}}>
                        <MUIDropdownItem text="Reading" icon={<LocalLibraryIcon/>}/>
                    </MUIRouterLink>

                    <MUIRouterLink to={{pathname: '/annotations', hash: '#review-flashcards'}}>
                        <MUIDropdownItem text="Flashcards" icon={<FlashOnIcon/>} onClick={this.props.onFlashcards}/>
                    </MUIRouterLink>

                </div>

            </MUIDropdownMenu>


        );

    }


}
