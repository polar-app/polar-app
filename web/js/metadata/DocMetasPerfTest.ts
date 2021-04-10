import {DocMetas} from "./DocMetas";

xdescribe('DocMetasPerf', function() {

    this.timeout(10000);

    const fingerprint = '0x0001';
    const docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, 14);
    const json = JSON.stringify(docMeta);

    const count = 100000;

    it("DocMetas.deserialize", function () {

        const before = Date.now();
        for (let i = 0; i < count; ++i) {
            DocMetas.deserialize(json, fingerprint);
        }
        const after = Date.now();

        const duration = after-before;
        console.log("duration: ", duration);

    })

    it("JSON.parse", function () {

        const before = Date.now();
        for (let i = 0; i < count; ++i) {
            JSON.parse(json);
        }
        const after = Date.now();

        const duration = after-before;
        console.log("duration: ", duration);

    })

});
