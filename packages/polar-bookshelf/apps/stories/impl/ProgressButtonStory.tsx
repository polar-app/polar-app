import * as React from "react";
import IconButton from "@material-ui/core/IconButton";
import FlashAutoIcon from '@material-ui/icons/FlashAuto';
import CircularProgress from '@material-ui/core/CircularProgress';
import {MUIButtonBar} from "../../../web/js/mui/MUIButtonBar";
import {StandardIconButton} from "../../repository/js/doc_repo/buttons/StandardIconButton";


interface IProps {
    readonly children: JSX.Element;
}

const IconWrapper = (props: IProps) => {
    return (
        <div style={{
                 width: '1em',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center'
             }}>
            {props.children}
        </div>
    );
}


export const ProgressButtonStory = () => {
    return (
        <div>

            <MUIButtonBar>

                <IconButton size="small">
                    <FlashAutoIcon/>
                </IconButton>

                <IconButton size="small">
                    <IconWrapper>
                        <FlashAutoIcon/>
                    </IconWrapper>
                </IconButton>

                <IconButton size="small">
                    <IconWrapper>
                        <CircularProgress size="1em"/>
                    </IconWrapper>
                </IconButton>

            </MUIButtonBar>

        </div>
    )
}