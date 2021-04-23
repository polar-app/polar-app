import {DocViewerAppURLs} from "./DocViewerAppURLs";
import {assertJSON} from "../../../web/js/test/Assertions";

describe('DocViewerAppURLs', function() {

    it("basic", function() {

        assertJSON(DocViewerAppURLs.parse("http://localhost:8050/doc/fdaeb192dba44afb4933a6e22b4f5089#15DzSGGmoW"),
                   {
                       "id": "fdaeb192dba44afb4933a6e22b4f5089"
                   });

        assertJSON(DocViewerAppURLs.parse("http://localhost:8050/doc/fdaeb192dba44afb4933a6e22b4f5089"),
                   {
                       "id": "fdaeb192dba44afb4933a6e22b4f5089"
                   });

        assertJSON(DocViewerAppURLs.parse("http://localhost:8050/doc/fdaeb192dba44afb4933a6e22b4f5089#"),
                   {
                       "id": "fdaeb192dba44afb4933a6e22b4f5089"
                   });


    });

});


