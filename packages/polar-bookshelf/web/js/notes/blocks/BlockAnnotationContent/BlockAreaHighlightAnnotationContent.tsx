import React from "react";
import {DocAnnotationMoment} from "../../../annotation_sidebar/DocAnnotationMoment";
import {BlockHighlightContentWrapper, BlockTagsSection} from "./BlockHighlightContentWrapper";
import {usePersistenceLayerContext} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {DocFileResolvers} from "../../../datastore/DocFileResolvers";
import {Images} from "../../../metadata/Images";
import {AreaHighlightAnnotationContent} from "../../content/AnnotationContent";
import {BlockEditorGenericProps} from "../../BlockEditor";
import {
    BlockAnnotationActionsWrapper,
    ISharedActionType,
    useSharedAnnotationBlockActions
} from "./BlockAnnotationActions";
import {BlockImageContent} from "../BlockImageContent";
import {ISODateString} from "polar-shared/src/metadata/ISODateTimeStrings";


interface IProps extends BlockEditorGenericProps {
    readonly annotation: AreaHighlightAnnotationContent;

    readonly created: ISODateString;
}

export const BlockAreaHighlightAnnotationContent: React.FC<IProps> = (props) => {
    const {
        annotation,
        id,
        parent,
        innerRef,
        readonly,
        onClick,
        onKeyDown,
        className,
        style,
    } = props;
    const highlight = annotation.value;
    const { persistenceLayerProvider } = usePersistenceLayerContext();
    const image = React.useMemo(() => {
        if (! highlight.image) {
            return undefined;
        }

        const resolver = DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider);
        return Images.toImg(resolver, highlight.image);
    }, [persistenceLayerProvider, highlight.image]);

    const actionsList: ISharedActionType[] = React.useMemo(() =>
        ['createFlashcard',  'changeColor', 'remove', 'open', 'editTags'], []);

    const actions = useSharedAnnotationBlockActions({
        id,
        annotation,
        actions: actionsList,
    });

    return (
        <BlockAnnotationActionsWrapper actions={actions}>
            <BlockHighlightContentWrapper color={highlight.color}>
                {image && (
                    <BlockImageContent
                        id={id}
                        parent={parent}
                        width={image.width}
                        height={image.height}
                        style={style}
                        className={className}
                        src={image.src}
                        innerRef={innerRef}
                        onClick={onClick}
                        readonly={readonly}
                        onKeyDown={onKeyDown} />
                )}
                <BlockTagsSection onClick={onClick} links={annotation.links} />
                <DocAnnotationMoment style={{ marginTop: 4 }} created={props.created} />
            </BlockHighlightContentWrapper>
        </BlockAnnotationActionsWrapper>
    );
};
