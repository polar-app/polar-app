import {AdobePDFExtractor} from "./AdobePDFExtractor";

describe("AdobePDFExtractor", function() {
    it("basic", async () => {
        await AdobePDFExtractor.extract()
    });
})
