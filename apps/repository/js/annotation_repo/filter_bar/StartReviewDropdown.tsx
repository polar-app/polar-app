import * as React from 'react';
import {MUIMenu} from "../../../../../web/spectron0/material-ui/dropdown_menu/MUIMenu";
import RateReviewIcon from '@material-ui/icons/RateReview';
import {MUIRouterLink} from "../../../../../web/spectron0/material-ui/MUIRouterLink";
import {MUIMenuItem} from "../../../../../web/spectron0/material-ui/dropdown_menu/MUIMenuItem";
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import FlashOnIcon from '@material-ui/icons/FlashOn';

export interface IProps {
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
            <MUIMenu id="start-review-dropdown"
                     button={{
                                color: "primary",
                                text: 'Start Review',
                                size: 'large',
                                disableRipple: true,
                                disableFocusRipple: true,
                                icon: <RateReviewIcon/>
                             }}
                     caret>
                <div>

                    <MUIRouterLink to={{pathname: '/annotations', hash: '#review-reading'}}>
                        <MUIMenuItem text="Reading" icon={<LocalLibraryIcon/>}/>
                    </MUIRouterLink>

                    <MUIRouterLink to={{pathname: '/annotations', hash: '#review-flashcards'}}>
                        <MUIMenuItem text="Flashcards" icon={<FlashOnIcon/>} />
                    </MUIRouterLink>

                </div>

            </MUIMenu>

        );

    }


}
