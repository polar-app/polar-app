import {Box, createStyles, makeStyles} from "@material-ui/core";
import {IBlockLink} from "polar-blocks/src/blocks/IBlock";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import React from "react";
import {DocInfos} from "polar-shared/src/metadata/DocInfos";
import {BlockEditorGenericProps} from "../BlockEditor";
import {BlockTagsSection} from "./BlockAnnotationContent/BlockHighlightContentWrapper";

const useStyles = makeStyles(() =>
    createStyles({
        infoSection: {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            fontSize: 12,
            marginTop: 4,
            fontWeight: 'normal',
            '& > *': {
                marginRight: 14,
            }
        }
    }),
);

interface IProps extends BlockEditorGenericProps {
    docInfo: IDocInfo;
    tagLinks: ReadonlyArray<IBlockLink>;
}


export const BlockDocumentContent: React.FC<IProps> = function BlockDocumentContent(props) {
    const { className, style, docInfo, tagLinks, onClick } = props;
    const classes = useStyles();
    const title = React.useMemo(() => DocInfos.bestTitle(docInfo), [docInfo]);

    return (
        <div className={className}
            style={style}>
            {title}
            <div className={classes.infoSection}>
                <div><b>Reading progress</b> {docInfo.progress}%</div>
                <Box alignItems="center" display="flex">
                    <b>Tags</b>&nbsp;&nbsp;<BlockTagsSection onClick={onClick} links={tagLinks} />
                </Box>
                
            </div>
        </div>
    );
};
