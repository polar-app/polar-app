import * as React from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";
import {Link} from "react-router-dom";
import {MUIDropdownMenu} from "../../../../../web/spectron0/material-ui/dropdown_menu/MUIDropdownMenu";
import RateReviewIcon from '@material-ui/icons/RateReview';
import {MUIRouterLink} from "../../../../../web/spectron0/material-ui/MUIRouterLink";
import {MUIDropdownItem} from "../../../../../web/spectron0/material-ui/dropdown_menu/MUIDropdownItem";
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';


export interface IProps {
    readonly onReading: () => void;
    readonly onFlashcards: () => void;
}

interface IState {

}

export class StartReviewDropdown extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (
            <MUIDropdownMenu button={{
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

                </div>

            </MUIDropdownMenu>

            
            //
            // <UncontrolledDropdown size="md"
            //                       direction="down"
            //                       id="start-review-dropdown">
            //
            //     <DropdownToggle size="md"
            //                     style={{fontWeight: 'bold'}}
            //                     color="success" caret>
            //
            //         <i className="fas fa-graduation-cap mr-1"/> Start Review
            //
            //     </DropdownToggle>
            //
            //     <DropdownMenu>
            //
            //         <Link to={{pathname: '/annotations', hash: '#review-reading'}} className="no-underline">
            //
            //             <DropdownItem size="sm"
            //                           style={{width: '100%'}}>
            //                 <i className="fas fa-book-reader" style={ICON_STYLE}/> Reading
            //             </DropdownItem>
            //
            //         </Link>
            //
            //         <Link to={{pathname: '/annotations', hash: '#review-flashcards'}} className="no-underline">
            //             <DropdownItem size="sm"
            //                           style={{width: '100%'}}
            //                           onClick={this.props.onFlashcards}>
            //                 <i className="fas fa-bolt" style={ICON_STYLE}/> Flashcards
            //             </DropdownItem>
            //         </Link>
            //
            //     </DropdownMenu>
            //
            // </UncontrolledDropdown>

        );

    }


}
