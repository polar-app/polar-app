import {createStyles, makeStyles} from "@material-ui/core";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Tag} from "polar-shared/src/tags/Tags";
import React from "react";
import {DocInfos} from "../../metadata/DocInfos";
import {BlockEditorGenericProps} from "../BlockEditor";

const useStyles = makeStyles(() =>
    createStyles({
        infoSection: {
            display: 'flex',
            fontSize: 9,
            marginTop: 4,
            fontWeight: 'normal',
            '& > div + div': {
                marginLeft: 12,
            }
        }
    }),
);

interface IProps extends BlockEditorGenericProps {
    docInfo: IDocInfo;
    tags: ReadonlyArray<Tag>;
}


export const BlockDocumentContent: React.FC<IProps> = function BlockDocumentContent(props) {
    const { className, style, docInfo, tags } = props;
    const classes = useStyles();
    const title = React.useMemo(() => DocInfos.bestTitle(docInfo), [docInfo]);

    const tagsText = React.useMemo(() => tags.map(({ label }) => label).join(', '), [tags]);

    return (
        <div className={className}
            style={style}>
            {title}
            <div className={classes.infoSection}>
                <div><b>Reading progress</b> {docInfo.progress}%</div>
                <div><b>Tags</b> {tagsText}</div>
            </div>
        </div>
    );
};
