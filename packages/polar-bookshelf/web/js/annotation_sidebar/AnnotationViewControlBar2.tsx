import * as React from 'react';
import {IDocAnnotationRef} from './DocAnnotation';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import CommentIcon from '@material-ui/icons/Comment';
import {DocAnnotationMoment} from "./DocAnnotationMoment";
import {DocAuthor} from "./DocAuthor";
import EditIcon from '@material-ui/icons/Edit';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import {MUIAnchor} from "../mui/MUIAnchor";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useAnnotationActiveInputContext} from "./AnnotationActiveInputContext";
import {useDocMetaContext} from "./DocMetaContextProvider";
import {ColorSelector} from "../ui/colors/ColorSelector";
import {useAnnotationMutationsContext} from "./AnnotationMutationsContext";
import {AnnotationTagButton2} from './AnnotationTagButton2';
import {MUIButtonBar} from "../mui/MUIButtonBar";
import makeStyles from '@material-ui/core/styles/makeStyles';
import {createStyles, CircularProgress} from "@material-ui/core";
import {deepMemo} from "../react/ReactUtils";
import {JumpToAnnotationButton} from "./buttons/JumpToAnnotationButton";
import {MUIDocDeleteButton} from "../../../apps/repository/js/doc_repo/buttons/MUIDocDeleteButton";
import {StandardIconButton} from "../../../apps/repository/js/doc_repo/buttons/StandardIconButton";
import FlashAutoIcon from '@material-ui/icons/FlashAuto';
import {useAutoFlashcardHandler} from "./AutoFlashcardHook";

const useStyles = makeStyles((theme) =>
    createStyles({
        // TODO: this isn't working as the buttons aren't taking the classname
        // properly.
        buttons: {
            color: theme.palette.text.secondary,
        },
    }),
);


interface IMutableProps {
    readonly mutable: boolean | undefined;
}

interface IAnnotationProps {
    readonly annotation: IDocAnnotationRef;
    readonly mutable: boolean | undefined;
}

const ChangeTextHighlightButton = deepMemo((props: IAnnotationProps) => {

    const {annotation} = props;

    const annotationInputContext = useAnnotationActiveInputContext();

    if (annotation.annotationType !== AnnotationType.TEXT_HIGHLIGHT) {
        // this should only be added on text highlights.
        return null;
    }

    return (
        <StandardIconButton tooltip="Change the content of a text highlight."
                            disabled={! props.mutable}
                            size="small"
                            onClick={() => annotationInputContext.setActive('text-highlight')}>

            <EditIcon/>

        </StandardIconButton>
    );

});

const CreateCommentButton = deepMemo((props: IMutableProps) => {

    const annotationInputContext = useAnnotationActiveInputContext();

    return (
        <StandardIconButton tooltip="Create a new comment"
                            disabled={! props.mutable}
                            size="small"
                            onClick={() => annotationInputContext.setActive('comment')}>

            <CommentIcon/>

        </StandardIconButton>
    );
});


const CreateFlashcardButton = deepMemo((props: IMutableProps) => {

    const annotationInputContext = useAnnotationActiveInputContext();

    return (
        <StandardIconButton tooltip="Create a new flashcard"
                            disabled={! props.mutable}
                            size="small"
                            onClick={() => annotationInputContext.setActive('flashcard')}>

            <FlashOnIcon/>
        </StandardIconButton>
    );


});

const CreateAutoFlashcardButton = deepMemo((props: IAnnotationProps) => {

    const [status, handler] = useAutoFlashcardHandler(props.annotation);

    // FIXME: we need to look at the users account here...

    return (
        <StandardIconButton tooltip="Create a new flashcard"
                            disabled={! props.mutable}
                            size="small"
                            onClick={handler}>

            <div style={{
                     width: '1em',
                     // height: '1em',
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center'
                 }}>
                {status === 'idle' && (
                    <FlashAutoIcon/>
                )}

                {status === 'waiting' && (
                    <CircularProgress size="1em"/>
                )}
            </div>

        </StandardIconButton>
    );

});


interface IProps {
    readonly annotation: IDocAnnotationRef;
}

export const AnnotationViewControlBar2 = React.memo((props: IProps) => {

    const { annotation } = props;

    const {doc} = useDocMetaContext();
    const annotationMutations = useAnnotationMutationsContext()

    const classes = useStyles();

    const handleColor = annotationMutations.createColorCallback({
        selected: [annotation],
    });

    const handleDelete = annotationMutations.createDeletedCallback({
        selected: [annotation]
    });

    return (

        <>
            <div style={{userSelect: 'none'}}
                 className="pt-1">

                <div style={{display: 'flex'}}>

                    <MUIButtonBar>

                        <DocAuthor author={annotation.author}/>

                        <MUIAnchor href="#"
                                   onClick={NULL_FUNCTION}>
                            <DocAnnotationMoment created={annotation.lastUpdated}/>
                        </MUIAnchor>

                    </MUIButtonBar>

                    <MUIButtonBar key="right-bar"
                                  className={classes.buttons}
                                  style={{
                                      justifyContent: 'flex-end',
                                      flexGrow: 1
                                  }}>

                        <JumpToAnnotationButton annotation={annotation}/>

                        <ChangeTextHighlightButton annotation={annotation}
                                                   mutable={doc?.mutable}/>

                        <CreateCommentButton mutable={doc?.mutable}/>

                        <CreateFlashcardButton mutable={doc?.mutable}/>

                        {/*<CreateAutoFlashcardButton mutable={doc?.mutable} annotation={annotation}/>*/}

                        {! annotation.immutable &&
                            <ColorSelector role='change'
                                           color={props.annotation.color || 'yellow'}
                                           onSelected={(color) => handleColor({color})}/>}

                        <AnnotationTagButton2 annotation={annotation}/>

                            {! annotation.immutable &&
                                <MUIDocDeleteButton size="small"
                                                    onClick={handleDelete}/>}

                    </MUIButtonBar>

                </div>

            </div>
        </>
    );
});
