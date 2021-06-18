import {BlocksToGraph} from "./BlocksToGraph";
import {MockBlocks} from "../../../../apps/stories/impl/MockBlocks";
import {assertJSON} from "../../test/Assertions";

describe("BlocksToGraph", function() {
    it("basic", () => {

        const graph = BlocksToGraph.convertBlocksToGraph(MockBlocks.create());

        assertJSON(graph, {});

    });
})
