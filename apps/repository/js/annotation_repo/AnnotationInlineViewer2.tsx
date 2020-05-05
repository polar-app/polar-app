import * as React from 'react';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {Img} from 'polar-shared/src/metadata/Img';
import {ResponsiveImg} from '../../../../web/js/annotation_sidebar/ResponsiveImg';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
import {
    useAnnotationRepoCallbacks,
    useAnnotationRepoStore
} from './AnnotationRepoStore';
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {AnnotationActiveInputContextProvider} from "../../../../web/js/annotation_sidebar/AnnotationActiveInputContext";
import {DocMetaContext} from "../../../../web/js/annotation_sidebar/DocMetaContextProvider";
import {AnnotationInputView} from "../../../../web/js/annotation_sidebar/AnnotationInputView";
import {AnnotationView2} from "../../../../web/js/annotation_sidebar/annotations/AnnotationView2";

const Styles: IStyleMap = {

    annotationText: {
        paddingTop: '5px',
    },

};

interface AnnotationImageProps {
    readonly id: string;
    readonly img?: Img;
}

const AnnotationImage = (props: AnnotationImageProps) => {
    return <ResponsiveImg id={props.id} img={props.img} defaultText=" "/>;
};

const NoAnnotationSelected = () => (
    <Box p={1}>

        <div className="text-center">
            <Typography align="center"
                        variant="h5"
                        color="textPrimary">
                No annotation selected.
            </Typography>
        </div>

    </Box>
);

interface AnnotationSelectedProps {
    readonly annotation: IDocAnnotation;
}

const AnnotationSelected = React.memo((props : AnnotationSelectedProps) => {

    const {annotation} = props;

    const callbacks = useAnnotationRepoCallbacks();

    console.log("FIXME: annotation: ", annotation);

    const docMetaContext = {
        docMeta: annotation.docMeta,
        mutable: true
    };

    return (

        <Paper square
               elevation={0}
               className="p-1"
               style={{
                   display: 'flex',
                   flexGrow: 1,
                   flexDirection: 'column'
               }}>

            <AnnotationActiveInputContextProvider>
                <>
                    <DocMetaContext.Provider value={docMetaContext}>
                        {/*<AnnotationViewControlBar2 annotation={annotation}/>*/}

                        <AnnotationView2 annotation={annotation}/>

                        <AnnotationInputView annotation={annotation}/>
                    </DocMetaContext.Provider>
                </>
            </AnnotationActiveInputContextProvider>

        </Paper>
    );
});

export const AnnotationInlineViewer2 = React.memo(() => {

    const store = useAnnotationRepoStore();

    const {selected, view} = store;

    const annotation = selected.length > 0 ? view[selected[0]] : undefined;

    if (annotation) {

        return (
            <AnnotationSelected annotation={annotation}/>
        );

    } else {
        return (
            <NoAnnotationSelected/>
        );

    }

});


