import React from "react";
import {IAreaHighlightAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {DocAnnotationMoment} from "../../../annotation_sidebar/DocAnnotationMoment";
import {createStyles, makeStyles} from "@material-ui/core";
import {BlockAnnotationContentWrapper} from "../../BlockAnnotationContentWrapper";
import {usePersistenceLayerContext} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {DocFileResolvers} from "../../../datastore/DocFileResolvers";
import {Images} from "../../../metadata/Images";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";


interface IProps {
    areaHighlight: IAreaHighlightAnnotationContent;
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
    const { areaHighlight: { value: highlight } } = props;
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
