import JSZip from "jszip";

describe("JSZIP", function() {

    it("Basic", async () => {
        const zip = new JSZip();
        zip.file("Hello.txt", "Hello World\n");
        const content = await zip.generateAsync({type:"blob"})
        console.log("FIXME: content ", content)
    });

})


