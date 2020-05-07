import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {useAnnotationRepoCallbacks} from './AnnotationRepoStore';
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import Divider from "@material-ui/core/Divider";
import {MUIButtonBar} from "../../../../web/spectron0/material-ui/MUIButtonBar";

interface IProps {
    readonly annotation: IDocAnnotation;
}

export const AnnotationInlineControlBar = React.memo((props : IProps) => {

    const {annotation} = props;

    const callbacks = useAnnotationRepoCallbacks();

    return (

        <>
            <div style={{
                     display: 'flex',
                     alignItems: "center"
                 }}
                 className="p-1">

                <div>
                    {annotation.docInfo.title || 'Untitled'}
                </div>

                <MUIButtonBar style={{
                                  alignItems: 'center',
                                  flexGrow: 1,
                                  justifyContent: "flex-end"
                              }}>
                    <IconButton onClick={() => callbacks.doOpen(annotation?.docInfo!)}>
                        <OpenInNewIcon/>
                    </IconButton>
                </MUIButtonBar>

            </div>
            <Divider/>
        </>

    );
});
