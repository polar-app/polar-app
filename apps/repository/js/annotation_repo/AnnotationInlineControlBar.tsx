import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {useAnnotationRepoCallbacks} from './AnnotationRepoStore';
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import Divider from "@material-ui/core/Divider";
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {MUITooltip} from "../../../../web/js/mui/MUITooltip";

interface IProps {
    readonly annotation: IDocAnnotation;
}

export const AnnotationInlineControlBar = deepMemo(function AnnotationInlineControlBar(props : IProps) {

    const {annotation} = props;

    const callbacks = useAnnotationRepoCallbacks();

    const docInfo = annotation?.docInfo;

    if (! docInfo) {
        return null;
    }

    return (

        <>
            <div style={{
                     display: 'flex',
                     alignItems: "center"
                 }}
                 className="p-1">

                {/* TODO: I think this should be bold, 14px and text-secondary */}
                <div style={{
                         fontSize: '14px'
                     }}>
                    {docInfo.title || 'Untitled'}
                </div>

                <MUIButtonBar style={{
                                  alignItems: 'center',
                                  flexGrow: 1,
                                  justifyContent: "flex-end"
                              }}>
                    <MUITooltip title="Open document">
                        <IconButton onClick={() => callbacks.doOpen(docInfo)}>
                            <OpenInNewIcon/>
                        </IconButton>
                    </MUITooltip>
                </MUIButtonBar>

            </div>
            <Divider/>
        </>

    );
});
