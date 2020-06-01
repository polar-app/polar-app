import * as React from 'react';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {Img} from 'polar-shared/src/metadata/Img';
import {ResponsiveImg} from '../../../../web/js/annotation_sidebar/ResponsiveImg';
import {DocPropTable} from "./meta_view/DocPropTable";
import Moment from "react-moment";
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Typography from "@material-ui/core/Typography";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Divider from "@material-ui/core/Divider";
import {AnnotationDeleteButton} from './buttons/AnnotationDeleteButton';
import {
    useAnnotationRepoCallbacks,
    useAnnotationRepoStore
} from './AnnotationRepoStore';
import {AnnotationTagsButton2} from "./buttons/AnnotationTagsButton2";
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";

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

    return (

        <Paper square
               elevation={0}
               className="p-1"
               style={{
                   display: 'flex',
                   flexGrow: 1,
                   flexDirection: 'column'
               }}>

            <div style={{display: 'flex'}}
                 className="mb-1">

                <div className="mt-auto mb-auto"
                     style={{flexGrow: 1}}>

                    <div style={{display: 'flex'}}>

                        <Moment withTitle={true}
                                titleFormat="D MMM YYYY hh:MM A"
                                format="MMM DD YYYY HH:mm A"
                                filter={(value) => value.replace(/^an? /g, '1 ')}>
                            {annotation.created}
                        </Moment>

                        <Box color="textSecondary">

                            (

                            <Moment withTitle={true}
                                    titleFormat="D MMM YYYY hh:MM A"
                                    fromNow>
                                {annotation.created}
                            </Moment>

                            )

                        </Box>

                    </div>

                </div>

                <div className="ml-auto mt-auto mb-auto">
                    <AnnotationTagsButton2 onTagged={callbacks.onTagged}/>
                </div>

                <div className="mt-auto mb-auto">
                    <AnnotationDeleteButton onDelete={callbacks.onDeleted}/>
                </div>

                <Divider orientation="vertical"/>

                <div className="mt-auto mb-auto">
                    <IconButton onClick={() => callbacks.doOpen(annotation?.docInfo!)}>
                        <OpenInNewIcon/>
                    </IconButton>
                </div>

            </div>

            <div style={{display: 'flex'}}>

                <div style={{flexGrow: 1, verticalAlign: 'top'}}>

                    <DocPropTable repoAnnotation={annotation}
                                  onDocumentLoadRequested={callbacks.doOpen}/>

                </div>

                <div>
                    {/*<DocThumbnail thumbnails={repoAnnotation.docInfo.thumbnails}*/}
                    {/*              persistenceLayerProvider={() => this.props.persistenceLayerManager.get()}/>*/}
                </div>

            </div>

            <div style={Styles.annotationText}>
                <div dangerouslySetInnerHTML={{__html: annotation.html || 'no text'}}/>
            </div>

            <AnnotationImage id={annotation.id} img={annotation.img}/>

            {/*<DocAnnotationComponent persistenceLayerProvider={() => this.props.persistenceLayerManager.get()}*/}
            {/*                        annotation={repoAnnotation}*/}
            {/*                        doc={{*/}
            {/*                            oid: 123,*/}
            {/*                            docInfo: repoAnnotation.docInfo,*/}
            {/*                            docMeta: repoAnnotation.docMeta,*/}
            {/*                            permission: {*/}
            {/*                                mode: 'rw'*/}
            {/*                            },*/}
            {/*                            mutable: true*/}
            {/*                        }}/>*/}

            {/*FIXME: I need to figure out how to get the 'doc' now*/}
            {/*<AnnotationControlBar doc={} annotation={}/>*/}

        </Paper>
    );
});

export const AnnotationInlineViewer = React.memo(() => {

    const store = useAnnotationRepoStore();

    const {selected, view} = store;

    // const annotation = selected.length > 0 ? view[selected[0]] : undefined;

    const annotation = undefined;

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


