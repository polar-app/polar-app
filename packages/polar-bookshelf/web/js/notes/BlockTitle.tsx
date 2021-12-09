import React from "react";
import {observer} from "mobx-react-lite"
import {Helmet} from "react-helmet";
import {MarkdownContentConverter} from "./MarkdownContentConverter";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {useBlocksStore} from "./store/BlocksStore";

interface IProps {
    readonly target: BlockIDStr;
}

export const BlockTitle = observer((props: IProps) => {

    const {target} = props;

    const blocksStore = useBlocksStore();
    const block = blocksStore.getBlockByTarget(target);

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
