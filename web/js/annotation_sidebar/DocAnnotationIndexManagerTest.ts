import {TestingTime} from '../test/TestingTime';
import {DocAnnotationIndex} from "./DocAnnotationIndex";
import {DocAnnotationIndexManager} from "./DocAnnotationIndexManager";
import {DocFileResolver} from "../datastore/DocFileResolvers";
import {Backend} from "../datastore/Backend";
import {FileRef, GetFileOpts} from "../datastore/Datastore";
import {DocFileMeta} from "../datastore/DocFileMeta";

describe('DocAnnotationIndexManager', function() {

    beforeEach(function() {
        TestingTime.freeze();
    });

    it("Updates and making sure the file is updated properly", function() {

        const docFileResolver: DocFileResolver = (backend: Backend, ref: FileRef, opts?: GetFileOpts): DocFileMeta => {
            return {backend, ref, url: 'file:///fake/url/path.jpg'};
        };

        const docAnnotationIndex = new DocAnnotationIndex();
        const docAnnotationIndexManager = new DocAnnotationIndexManager(docFileResolver, docAnnotationIndex, () => {
            console.log("updated");
        });

    });

});
