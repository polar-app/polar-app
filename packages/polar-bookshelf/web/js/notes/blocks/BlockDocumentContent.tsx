import {createStyles, makeStyles} from "@material-ui/core";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
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
}


export const BlockDocumentContent: React.FC<IProps> = function BlockDocumentContent(props) {
    const { className, style, docInfo } = props;
    const classes = useStyles();
    const title = React.useMemo(() => DocInfos.bestTitle(docInfo), [docInfo.title]);
    const tags = React.useMemo(() => {
        const tags = Object.values(docInfo.tags || {});
        if (tags.length === 0) {
            return "No tags.";
        }
        return tags.map(tag => tag.label).join(', ');
    }, [docInfo.tags]);

    return (
        <div className={className}
            style={style}>
            {title}
            <div className={classes.infoSection}>
                <div><b>Reading progress</b> {docInfo.progress}%</div>
                <div><b>Tags</b> {tags}</div>
            </div>
        </div>
    );
};
