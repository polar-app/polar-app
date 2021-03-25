import * as React from 'react';
import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
import {useAnnotationRepoStore} from './AnnotationRepoStore';
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {AnnotationActiveInputContextProvider} from "../../../../web/js/annotation_sidebar/AnnotationActiveInputContext";
import {DocMetaContextProvider} from "../../../../web/js/annotation_sidebar/DocMetaContextProvider";
import {AnnotationView2} from "../../../../web/js/annotation_sidebar/annotations/AnnotationView2";
import {AnnotationInlineControlBar} from './AnnotationInlineControlBar';
import {FeedbackPadding} from "../ui/FeedbackPadding";
import {MUIElevation} from "../../../../web/js/mui/MUIElevation";


const NoAnnotationSelected = () => (
    <MUIElevation elevation={0}
                  style={{
                      display: 'flex',
                      flexGrow: 1,
                  }}>

        <Box p={1}>

            <div className="text-center">
                <Typography align="center"
                            variant="h5"
                            color="textPrimary">
                    No annotation selected.
                </Typography>
            </div>

        </Box>
    </MUIElevation>
);

interface AnnotationSelectedProps {
    readonly annotation: IDocAnnotation;
}

const AnnotationSelected = React.memo(function AnnotationSelected(props : AnnotationSelectedProps) {

    const {annotation} = props;

    const doc = {
        docMeta: annotation.docMeta,
        mutable: true
    };

    // TODO we need the same context menu work here...

    return (

        <MUIElevation elevation={0}
                      style={{
                          display: 'flex',
                          flexGrow: 1,
                          flexDirection: 'column'
                       }}>

            <AnnotationActiveInputContextProvider>
                <>
                    <DocMetaContextProvider doc={doc}>

                        <>
                            <AnnotationInlineControlBar annotation={annotation}/>

                            <MUIElevation elevation={0}>
                                <FeedbackPadding>
                                    <div className="mt-1">
                                        <AnnotationView2 annotation={annotation}/>
                                    </div>
                                </FeedbackPadding>
                            </MUIElevation>
                        </>
                    </DocMetaContextProvider>
                </>
            </AnnotationActiveInputContextProvider>

        </MUIElevation>
    );
});

export const AnnotationInlineViewer2 = React.memo(() => {

    const {selected, view} = useAnnotationRepoStore(['selected', 'view']);

    const annotation = selected.length > 0 ? view.filter(current => current.id === selected[0])[0] : undefined;

    return (
        <>
            {annotation ? <AnnotationSelected annotation={annotation}/> : <NoAnnotationSelected/>}
        </>
    );

});


