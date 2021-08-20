import React from "react";
import {DocAnnotationMoment} from "../../../annotation_sidebar/DocAnnotationMoment";
import {BlockAnnotationContentWrapper} from "./BlockAnnotationContentWrapper";
import {usePersistenceLayerContext} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {DocFileResolvers} from "../../../datastore/DocFileResolvers";
import {Images} from "../../../metadata/Images";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {AreaHighlightAnnotationContent} from "../../content/AnnotationContent";
import {BlockEditorGenericProps} from "../../BlockEditor";
import {BlockAnnotationActionsWrapper, useSharedAnnotationBlockActions} from "./BlockAnnotationActions";
import {BlockImageContent} from "../BlockImageContent";


interface IProps extends BlockEditorGenericProps {
    annotation: AreaHighlightAnnotationContent;
    id: BlockIDStr;
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
        active,
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
            <BlockAnnotationContentWrapper color={highlight.color}>
                {image && (
                    <BlockImageContent
                        id={id}
                        active={active}
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
                <DocAnnotationMoment created={highlight.created} />
            </BlockAnnotationContentWrapper>
        </BlockAnnotationActionsWrapper>
    );
};
