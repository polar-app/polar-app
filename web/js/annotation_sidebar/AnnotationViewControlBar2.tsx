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
import {MUIGridLayout} from "../../spectron0/material-ui/dropdown_menu/MUIGridLayout";
import Divider from "@material-ui/core/Divider";
import isEqual from "react-fast-compare";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useAnnotationActiveInputContext} from "./AnnotationActiveInputContext";
import {useDocMetaContext} from "./DocMetaContextProvider";
import {ColorSelector} from "../ui/colors/ColorSelector";
import {useAnnotationMutationContext} from "./AnnotationMutationContext";
import {AnnotationDropdown} from "./AnnotationDropdown";
import {AnnotationDropdown2} from "./AnnotationDropdown2";

interface IMutableProps {
    readonly mutable: boolean;
}

interface IAnnotationProps {
    readonly annotation: IDocAnnotation;
    readonly mutable: boolean;
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

    const docMetaContext = useDocMetaContext();
    const annotationMutationContext = useAnnotationMutationContext()

    return (
        //
        // {/*// onClick={() => onJumpToContext(annotation)}>*/}

        <>
            <div style={{userSelect: 'none'}}
                 className="pt-1 pb-1">

                <div style={{display: 'flex'}}>

                    <MUIGridLayout items={[
                        <DocAuthor key="author" author={annotation.author}/>,

                        <MUIAnchor key="moment"
                                   href="#"
                                   onClick={NULL_FUNCTION}>
                            <DocAnnotationMoment created={annotation.created}/>
                        </MUIAnchor>

                    ]}/>

                    {/*<MUIHoverListener style={{display: 'flex', flexGrow: 1}}>*/}
                    <MUIGridLayout key="right-bar"
                                   style={{
                                      justifyContent: 'flex-end',
                                      flexGrow: 1
                                   }}
                                   items={[
                                       <ChangeTextHighlightButton key="highlight-button"
                                                                  annotation={annotation}
                                                                  mutable={docMetaContext.mutable}/>,
                                       <CreateCommentButton key="comment-button"
                                                            mutable={docMetaContext.mutable}/>,

                                       <CreateFlashcardButton key="flashcard-button"
                                                              mutable={docMetaContext.mutable}/>,

                                       <React.Fragment key="color-selector">
                                            {! annotation.immutable &&
                                                <ColorSelector color={props.annotation.color || 'yellow'}
                                                               onSelected={color => annotationMutationContext.onColor(color)}/>}
                                       </React.Fragment>,

                                       <AnnotationDropdown2 key="annotation-dropdown"
                                                            id={'annotation-dropdown-' + annotation.id}
                                                            disabled={annotation.immutable}
                                                            annotation={annotation}/>
                                   ]}/>

                    {/*</MUIHoverListener>*/}

                        {/*TODO: make these a button with a 'light' color and size of 'sm'*/}

                        {/*<TagInputControl className='ml-1 p-1 text-muted'*/}
                        {/*                 container="body"*/}
                        {/*                 availableTags={this.props.tagsProvider()}*/}
                        {/*                 existingTags={() => annotation.tags ? Object.values(annotation.tags) : []}*/}
                        {/*                 onChange={(tags) => this.onTagged(tags)}/>*/}

                </div>

            </div>
            <Divider/>
        </>
    );
});
