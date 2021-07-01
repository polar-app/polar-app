import React from "react";
import {observer} from "mobx-react-lite"
import {Helmet} from "react-helmet";
import {MarkdownContentConverter} from "./MarkdownContentConverter";
import {useBlocksTreeStore} from "./BlocksTree";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";

interface IProps {
    readonly id: BlockIDStr;
}

export const BlockTitle = observer((props: IProps) => {

    const {id} = props;

    const blocksTreeStore = useBlocksTreeStore();
    const block = blocksTreeStore.getBlock(id);

    const title = React.useMemo(() : string => {

        switch(block?.content.type) {

            case "markdown":
                return MarkdownContentConverter.toText(block.content.type);
            case "name":
                return block.content.data;
            case "image":
                return '';
            case "date":
                return block.content.data;
            default:
                return ''

        }

    }, [block]);

    return (
        <Helmet>
            <title>Polar: {title}</title>
        </Helmet>
    );
});
