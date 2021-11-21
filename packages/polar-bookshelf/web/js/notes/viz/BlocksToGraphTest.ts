import {BlocksToGraph} from "./BlocksToGraph";
import {MockBlocks} from "../../../../apps/stories/impl/MockBlocks";
import {assertJSON} from "polar-test/src/test/Assertions";
import {TestingTime} from "polar-shared/src/test/TestingTime";

describe("BlocksToGraph", function() {
    it("basic", () => {

        TestingTime.freeze();
        const graph = BlocksToGraph.convertBlocksToGraph(MockBlocks.create());

        console.log(JSON.stringify(graph));
        assertJSON(graph, {"nodes":[{"id":"102","label":"World War II","meta":{"createdAt":"2012-03-02T11:38:49.321Z","updatedAt":"2012-03-02T11:38:49.321Z"}},{"id":"108","label":"Russia","meta":{"createdAt":"2012-03-02T11:38:49.321Z","updatedAt":"2012-03-02T11:38:49.321Z"}},{"id":"109","label":"Canada","meta":{"createdAt":"2012-03-02T11:38:49.321Z","updatedAt":"2012-03-02T11:38:49.321Z"}},{"id":"107","label":"Germany","meta":{"createdAt":"2012-03-02T11:38:49.321Z","updatedAt":"2012-03-02T11:38:49.321Z"}},{"id":"112","label":"Winston Churchill","meta":{"createdAt":"2012-03-02T11:38:49.321Z","updatedAt":"2012-03-02T11:38:49.321Z"}},{"id":"113","label":"Image parent","meta":{"createdAt":"2012-03-02T11:38:49.321Z","updatedAt":"2012-03-02T11:38:49.321Z"}}],"edges":[{"source":"102","target":"108"},{"source":"102","target":"109"},{"source":"102","target":"112"},{"source":"107","target":"102"}]});

        TestingTime.unfreeze();
    });
})
