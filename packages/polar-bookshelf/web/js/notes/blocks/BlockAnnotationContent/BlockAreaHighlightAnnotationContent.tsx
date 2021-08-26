import React from "react";
import {DocAnnotationMoment} from "../../../annotation_sidebar/DocAnnotationMoment";
import {BlockHighlightContentWrapper} from "./BlockHighlightContentWrapper";
import {usePersistenceLayerContext} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {DocFileResolvers} from "../../../datastore/DocFileResolvers";
import {Images} from "../../../metadata/Images";
import {AreaHighlightAnnotationContent} from "../../content/AnnotationContent";
import {BlockEditorGenericProps} from "../../BlockEditor";
import {BlockAnnotationActionsWrapper, useSharedAnnotationBlockActions} from "./BlockAnnotationActions";
import {BlockImageContent} from "../BlockImageContent";


interface IProps extends BlockEditorGenericProps {
    annotation: AreaHighlightAnnotationContent;
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

    const actions = useSharedAnnotationBlockActions({ id, annotation });

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
                <DocAnnotationMoment style={{ marginTop: 2 }} created={highlight.created} />
            </BlockHighlightContentWrapper>
        </BlockAnnotationActionsWrapper>
    );
};
