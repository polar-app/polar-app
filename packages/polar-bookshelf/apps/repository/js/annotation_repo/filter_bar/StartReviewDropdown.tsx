import * as React from 'react';
import {MUIMenu} from "../../../../../web/js/mui/menu/MUIMenu";
import RateReviewIcon from '@material-ui/icons/RateReview';
import {MUIRouterLink} from "../../../../../web/js/mui/MUIRouterLink";
import {MUIMenuItem} from "../../../../../web/js/mui/menu/MUIMenuItem";
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import {memoForwardRef} from "../../../../../web/js/react/ReactUtils";

export const StartReviewDropdown = memoForwardRef(() => (

    <MUIMenu id="start-review-dropdown"
             button={{
                 color: "primary",
                 text: 'Start Review',
                 size: 'large',
                 disableRipple: true,
                 disableFocusRipple: true,
                 icon: <RateReviewIcon/>,
                 style: {
                     minWidth: '285px'
                 }
             }}
             caret>
        <div>

            <MUIRouterLink
                to={{pathname: '/annotations', hash: '#review-flashcards'}}>
                <MUIMenuItem text="Flashcards" icon={<FlashOnIcon/>}/>
            </MUIRouterLink>

            <MUIRouterLink
                to={{pathname: '/annotations', hash: '#review-reading'}}>
                <MUIMenuItem text="Reading" icon={<LocalLibraryIcon/>}/>
            </MUIRouterLink>

        </div>

    </MUIMenu>

));
