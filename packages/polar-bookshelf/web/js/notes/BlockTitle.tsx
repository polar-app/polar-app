import React from "react";
import { BlockIDStr, useBlocksStore } from "./store/BlocksStore";
import { observer,  } from "mobx-react-lite"
import {Helmet} from "react-helmet";
import {MarkdownContentConverter} from "./MarkdownContentConverter";

interface IProps {
    readonly id: BlockIDStr;
}

export const BlockTitle = observer((props: IProps) => {

    const {id} = props;

    const blocksStore = useBlocksStore();
    const block = blocksStore.getReadonlyBlock(id);

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
