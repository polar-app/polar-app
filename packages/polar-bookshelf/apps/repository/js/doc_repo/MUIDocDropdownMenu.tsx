import React from 'react';
import Menu from '@material-ui/core/Menu';
import {MUIDocDropdownMenuItems} from './MUIDocDropdownMenuItems';
import {Callback} from "polar-shared/src/util/Functions";

interface IProps {
    readonly anchorEl: HTMLElement;
    readonly onClose: Callback;
}

// FIXME: memoize this as the props don't change very often and it's
// being regenerated.  FIXME move to functional component.
export class MUIDocDropdownMenu extends React.Component<IProps> {
    public render() {

        const {anchorEl} = this.props;

        return (
            <Menu
                id="doc-dropdown-menu"
                anchorEl={anchorEl}
                keepMounted
                getContentAnchorEl={null}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                transformOrigin={{vertical: "top", horizontal: "center"}}
                open={Boolean(anchorEl)}
                onClose={() => this.props.onClose()}
                onClick={() => this.props.onClose()}>

                <MUIDocDropdownMenuItems/>

            </Menu>
        );
    }
}
