import * as React from 'react';
import {IDocAnnotation} from './DocAnnotation';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import CommentIcon from '@material-ui/icons/Comment';
import {DocAnnotationMoment} from "./DocAnnotationMoment";
import {DocAuthor} from "./DocAuthor";
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import {MUIAnchor} from "../../spectron0/material-ui/MUIAnchor";
import Divider from "@material-ui/core/Divider";
import isEqual from "react-fast-compare";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useAnnotationActiveInputContext} from "./AnnotationActiveInputContext";
import {useDocMetaContext} from "./DocMetaContextProvider";
import {ColorSelector} from "../ui/colors/ColorSelector";
import {useAnnotationMutationsContext} from "./AnnotationMutationsContext";
import {AnnotationDropdown2} from "./AnnotationDropdown2";
import {AnnotationTagButton2} from './AnnotationTagButton2';
import {MUIButtonBar} from "../mui/MUIButtonBar";
import makeStyles from '@material-ui/core/styles/makeStyles';
import {createStyles} from "@material-ui/core";


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
    readonly annotation: IDocAnnotation;
    readonly mutable: boolean | undefined;
}

const ChangeTextHighlightButton = React.memo((props: IAnnotationProps) => {

    const {annotation} = props;

    const annotationInputContext = useAnnotationActiveInputContext();

    if (annotation.annotationType !== AnnotationType.TEXT_HIGHLIGHT) {
        // this should only be added on text highlights.
        return null;
    }
    return (
        <IconButton disabled={! props.mutable}
                    size="small"
                    onClick={() => annotationInputContext.setActive('text-highlight')}>

            <EditIcon/>

        </IconButton>
    );
}, isEqual);

const CreateCommentButton = React.memo((props: IMutableProps) => {

    const annotationInputContext = useAnnotationActiveInputContext();

    return (
        <IconButton disabled={! props.mutable}
                    size="small"
                    onClick={() => annotationInputContext.setActive('comment')}>

            <CommentIcon/>

        </IconButton>
    );
}, isEqual);


const CreateFlashcardButton = React.memo((props: IMutableProps) => {

    const annotationInputContext = useAnnotationActiveInputContext();

    return (
        <IconButton disabled={! props.mutable}
                    size="small"
                    onClick={() => annotationInputContext.setActive('flashcard')}>

            <FlashOnIcon/>

        </IconButton>
    );
}, isEqual);

interface IProps {
    readonly annotation: IDocAnnotation;
}

export const AnnotationViewControlBar2 = React.memo((props: IProps) => {

    const { annotation } = props;

    const {doc} = useDocMetaContext();
    const annotationMutations = useAnnotationMutationsContext()

    const classes = useStyles();

    const handleColor = annotationMutations.createColorCallback({
        selected: [annotation],
    });

    return (

        <>
            <div style={{userSelect: 'none'}}
                 className="pt-1 pb-1">

                <div style={{display: 'flex'}}>

                    <MUIButtonBar>

                        <DocAuthor author={annotation.author}/>

                        <MUIAnchor href="#"
                                   onClick={NULL_FUNCTION}>
                            <DocAnnotationMoment created={annotation.created}/>
                        </MUIAnchor>

                    </MUIButtonBar>

                    <MUIButtonBar key="right-bar"
                                  className={classes.buttons}
                                  style={{
                                      justifyContent: 'flex-end',
                                      flexGrow: 1
                                  }}>
                           <ChangeTextHighlightButton annotation={annotation}
                                                      mutable={doc?.mutable}/>

                           <CreateCommentButton mutable={doc?.mutable}/>

                           <CreateFlashcardButton mutable={doc?.mutable}/>

                            {! annotation.immutable &&
                                <ColorSelector color={props.annotation.color || 'yellow'}
                                               onSelected={(color) => handleColor({color})}/>}

                           <AnnotationTagButton2 annotation={annotation}/>

                           <AnnotationDropdown2 id={'annotation-dropdown-' + annotation.id}
                                                disabled={annotation.immutable}
                                                annotation={annotation}/>
                    </MUIButtonBar>

                </div>

            </div>
            <Divider/>
        </>
    );
});
