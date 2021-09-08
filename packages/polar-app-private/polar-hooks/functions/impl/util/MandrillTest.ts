import {EmailAddress, Mandrill} from "./Mandrill";

describe('Mandrill', function() {

    it("basic", async function() {

        const from: EmailAddress = {
            email: 'burton@getpolarized.io'
        };

        const to: EmailAddress = {
            email: 'burton@getpolarized.io'
        };

        const result = await Mandrill.sendDocumentShared(from, [to], 'test document', 'unit test', 'http://www.example.com');

    });

});
