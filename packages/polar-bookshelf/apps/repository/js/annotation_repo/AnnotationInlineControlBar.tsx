import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {useAnnotationRepoCallbacks} from './AnnotationRepoStore';
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import Divider from "@material-ui/core/Divider";
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";
import Tooltip from '@material-ui/core/Tooltip';
import {deepMemo} from "../../../../web/js/react/ReactUtils";

interface IProps {
    readonly annotation: IDocAnnotation;
}

export const AnnotationInlineControlBar = deepMemo((props : IProps) => {

    const {annotation} = props;

    const callbacks = useAnnotationRepoCallbacks();

    return (

        <>
            <div style={{
                     display: 'flex',
                     alignItems: "center"
                 }}
                 className="p-1">

                {/* TODO: I think this should be bold, 14px and text-secondary */}
                <div style={{
                         // fontWeight: 'bold'
                     }}>
                    {annotation.docInfo?.title || 'Untitled'}
                </div>

                <MUIButtonBar style={{
                                  alignItems: 'center',
                                  flexGrow: 1,
                                  justifyContent: "flex-end"
                              }}>
                    <Tooltip title="Open document">
                        <IconButton onClick={() => callbacks.doOpen(annotation?.docInfo!)}>
                            <OpenInNewIcon/>
                        </IconButton>
                    </Tooltip>
                </MUIButtonBar>

            </div>
            <Divider/>
        </>

    );
});
