import React from "react";
import {DocAnnotationMoment} from "../../../annotation_sidebar/DocAnnotationMoment";
import {createStyles, makeStyles} from "@material-ui/core";
import {BlockAnnotationContentWrapper} from "./BlockAnnotationContentWrapper";
import {usePersistenceLayerContext} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {DocFileResolvers} from "../../../datastore/DocFileResolvers";
import {Images} from "../../../metadata/Images";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {AreaHighlightAnnotationContent} from "../../content/AnnotationContent";
import {BlockEditorGenericProps} from "../../BlockEditor";


interface IProps extends BlockEditorGenericProps {
    annotation: AreaHighlightAnnotationContent;
    id: BlockIDStr;
}

export const useStyles = makeStyles(() =>
    createStyles({
        image: {
            maxWidth: '100%',
            display: 'block',
        },
        imageOuter: {
            marginBottom: 4
        },
    }),
);

export const BlockAreaHighlightAnnotationContent: React.FC<IProps> = (props) => {
    const classes = useStyles();
    const { annotation } = props;
    const highlight = annotation.value;
    const { persistenceLayerProvider } = usePersistenceLayerContext();
    const image = React.useMemo(() => {
        if (! highlight.image) {
            return undefined;
        }
        const resolver = DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider);
        return Images.toImg(resolver, highlight.image);
    }, [persistenceLayerProvider, highlight.image]);

    return (
        <BlockAnnotationContentWrapper color={highlight.color}>
            {image && (
                <div className={classes.imageOuter}><img className={classes.image} src={image.src} /></div>
            )}
            <DocAnnotationMoment created={highlight.created} />
        </BlockAnnotationContentWrapper>
    );
};
