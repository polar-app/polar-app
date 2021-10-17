import {Buffers} from "./Buffers";

describe("Buffers", function() {
    it("basic", () => {
        Buffers.toArrayBuffer(Buffer.from('hello'));
    });
})
