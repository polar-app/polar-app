import {PDFText, PDFTextWordMerger} from "./PDFText";
import {assert} from 'chai';
import {assertJSON} from "polar-test/src/test/Assertions";
import IPDFTextContent = PDFText.IPDFTextContent;
import IPDFTextWord = PDFTextWordMerger.IPDFTextWord;
import {Numbers} from "polar-shared/src/util/Numbers";

// TODO:
//
// I think it should be possible to build a function that can intelligently
// extract text, on the backend, from the PDF document directly.
//
// The following is needed I think:
//
// - Take all the text, and merge the items based on their position to determine
//   if a space should be between them.
//
// - Merge them into one large object with each line of text merged including,
//   ideally, its bounding box.
//
// - Do this per page and we don't need to do it as a stream, we can group on
//   the y index of each item then join those base on spaces, and new lines are \n
//
// - we have some words that have extra spaces due to them being different glyphs
//
// -

describe('PDFText', function() {

    const dumpTextContent = async (pdfTextContent: IPDFTextContent) => {
        const {extract, pageNum} = pdfTextContent;

        const content = extract.map(current => current.map(word => word.str).join(" ")).join("\n");

        console.log("pdfTextContent: ", JSON.stringify(pdfTextContent, null, '  '))

        console.log("pageNum: ", pageNum);
        console.log("content: \n", content)

    };

    interface ITextCapture {
        readonly onPDFTextContent: (pdfTextContent: IPDFTextContent) => void;
        readonly toString: () => string;
    }

    function createTextCapture() {

        let text = '';

        const onPDFTextContent = async (pdfTextContent: IPDFTextContent) => {

            const {extract, pageNum} = pdfTextContent;

            const content = extract.map(current => current.map(word => word.str).join(" ")).join("\n");
            text += content;
        }

        const toString = (): string => {
            return text;
        }

        return {onPDFTextContent, toString};

    }

    it("basic read", async function () {

        // TODO: still missing characters like:

        // tion 6 describes some of the re nements that we made
        //   - this might be a unicode char ?
        //
        // - we need to join words with hyphens into their original text... but
        //   maybe also keep the hyphenated text too.
        //
        //      - I think we can handle this by making have a set of mutations
        //        that show which offset words were joined and re-hyphenated so
        //        that we can reconstruct the original text or have split /
        //        hyphen points.
        //
        //      - We're also, arguably, going to need a way to keep the original
        //        boxes but I think we could just also anchor just on the raw text
        //
        //      - MAYBE I just index both forms / but I'm not sure if ES can do
        //        this for me. Basically, the idea is to implement BOTH forms as
        //        terms but not sure...

        // Write this in my standup and we should implement it soon:
        //
        // - Built out a framework for extracting PDF text from documents for PoC of AI.
        // The major blocker is actually hyphenation and whether we store metadata about
        // the regions of text and where they are located in the document.  What I'm
        // thinking of doing is storing a 'hyphen' map to document where the chars are
        // split, and what split char is used. Sometimes, they don't use the normal '-'
        // char but a wider one from unicode and we should reconstruct the exact original
        // document.  We could also have a map that stores the text offsets, and the box
        // (x, y, width, height) in the document where that text is found. This would be
        // AFTER applying the hyphen map.  This seems like I'm getting ahead of myself but
        // this is a major issue because without this data we can't jump to the place in
        // the document where the hit is indexed and I don't want an in-elegant solution
        // here.

        await PDFText.getText('../../packages/polar-bookshelf/docs/examples/pdf/bigtable.pdf', dumpTextContent, {maxPages: 1});

    });

    it("first page of two column PDF", async () => {

        const textCapture = createTextCapture();

        await PDFText.getText('../../packages/polar-bookshelf/docs/examples/pdf/bigtable.pdf', textCapture.onPDFTextContent, {maxPages: 1});

        assert.equal(textCapture.toString(), "Bigtable: A Distributed Storage System for Structured Data\n" +
            "Fay Chang, Jeffrey Dean, Sanjay Ghemawat, Wilson C. Hsieh, Deborah A. Wallach\n" +
            "Mike Burrows, Tushar Chandra, Andrew Fikes, Robert E. Gruber\n" +
            "ffay,jeff,sanjay,wilsonh,kerr,m3b,tushar,kes,gruberg@google.com\n" +
            "Google, Inc.\n" +
            "Abstract\n" +
            "Bigtable is a distributed storage system for managing\n" +
            "structured data that is designed to scale to a very large\n" +
            "size: petabytes of data across thousands of commodity\n" +
            "servers. Many projects at Google store data in Bigtable,\n" +
            "including web indexing, Google Earth, and Google Fi-\n" +
            "nance. These applications place very different demands\n" +
            "on Bigtable, both in terms of data size (from URLs to\n" +
            "web pages to satellite imagery) and latency requirements\n" +
            "(from backend bulk processing to real-time data serving).\n" +
            "Despite these varied demands, Bigtable has successfully\n" +
            "provided a exible, high-performance solution for all of\n" +
            "these Google products. In this paper we describe the sim-\n" +
            "ple data model provided by Bigtable, which gives clients\n" +
            "dynamic control over data layout and format, and we de-\n" +
            "scribe the design and implementation of Bigtable.\n" +
            "1 Introduction\n" +
            "Over the last two  and a  half years we have  designed,\n" +
            "implemented, and deployed a distributed storage system\n" +
            "for managing structured data at Google called Bigtable.\n" +
            "Bigtable is designed to reliably scale to petabytes of\n" +
            "data and thousands of machines. Bigtable has achieved\n" +
            "several goals: wide applicability,  scalability,  high per-\n" +
            "formance, and high availability. Bigtable is used by\n" +
            "more than sixty Google products and projects, includ-\n" +
            "ing Google Analytics, Google Finance, Orkut, Person-\n" +
            "alized Search, Writely, and Google Earth. These prod-\n" +
            "ucts use Bigtable for a variety of demanding workloads,\n" +
            "which range from throughput-oriented batch-processing\n" +
            "jobs to latency-sensitive  serving of data to end users.\n" +
            "The Bigtable clusters used by these products span a wide\n" +
            "range of congurations, from a handful to thousands of\n" +
            "servers, and store up to several hundred terabytes of data.\n" +
            "In many ways, Bigtable resembles a database: it shares\n" +
            "many implementation strategies with databases. Paral-\n" +
            "lel databases [14] and main-memory databases [13] have\n" +
            "achieved scalability and high performance, but Bigtable\n" +
            "provides a different interface than such systems. Bigtable\n" +
            "does not support a full relational data model; instead, it\n" +
            "provides clients with a simple data model that supports\n" +
            "dynamic control over data layout and format, and al-\n" +
            "lows clients to reason about the locality properties of the\n" +
            "data represented in the underlying storage. Data is in-\n" +
            "dexed using row and column names that can be arbitrary\n" +
            "strings. Bigtable also treats data as uninterpreted strings,\n" +
            "although clients often serialize various forms of struc-\n" +
            "tured and semi-structured data into these strings. Clients\n" +
            "can control the locality of their data through careful\n" +
            "choices in their schemas. Finally, Bigtable schema pa-\n" +
            "rameters let clients dynamically control whether to serve\n" +
            "data out of memory or from disk.\n" +
            "Section 2 describes the data model in more detail, and\n" +
            "Section 3 provides an overview of the client API. Sec-\n" +
            "tion 4 briey describes the underlying Google infrastruc-\n" +
            "ture on which Bigtable depends. Section 5 describes the\n" +
            "fundamentals of the Bigtable implementation, and Sec-\n" +
            "tion 6 describes some of the renements that we made\n" +
            "to improve Bigtable's performance. Section 7 provides\n" +
            "measurements of Bigtable's performance. We describe\n" +
            "several examples of how Bigtable is used at Google\n" +
            "in Section 8, and discuss some lessons we learned in\n" +
            "designing and supporting Bigtable in Section 9. Fi-\n" +
            "nally, Section 10 describes related work, and Section 11\n" +
            "presents our conclusions.\n" +
            "2 Data Model\n" +
            "A Bigtable is a  sparse, distributed, persistent multi-\n" +
            "dimensional sorted map. The map is indexed by a row\n" +
            "key, column key, and a timestamp; each value in the map\n" +
            "is an uninterpreted array of bytes.\n" +
            "(row:string, column:string, time:int64) ! string\n" +
            "To appear in OSDI 2006 1")

    });

    xit("Dump of Astronomy Content p293", async () => {

        const targetPage = 291

        await PDFText.getText('/Users/burton/astronomy.pdf', dumpTextContent, {
            skipPages: Numbers.range(1, targetPage),
            maxPages: targetPage + 2
        });

    });

    it("test merge words", () => {

        assertJSON(PDFTextWordMerger.doMergeWords(MERGE_DATA), [
            {
                "pageNum": 1,
                "x": 122.52,
                "y": 124.44000000000005,
                "height": 14.3462,
                "width": 55.7493332,
                "str": "Bigtable:"
            },
            {
                "pageNum": 1,
                "x": 182.7095,
                "y": 124.44000000000005,
                "height": 14.3462,
                "width": 83.8382788,
                "str": "A Distributed"
            },
            {
                "pageNum": 1,
                "x": 270.0279,
                "y": 124.44000000000005,
                "height": 14.3462,
                "width": 46.98380499999999,
                "str": "Storage"
            },
            {
                "pageNum": 1,
                "x": 320.6118,
                "y": 124.44000000000005,
                "height": 14.3462,
                "width": 43.885025799999994,
                "str": "System"
            },
            {
                "pageNum": 1,
                "x": 367.9769,
                "y": 124.44000000000005,
                "height": 14.3462,
                "width": 17.9744528,
                "str": "for"
            }
        ]);

    });

    it('canMerge', () => {

        assert.isFalse(PDFTextWordMerger.canMerge(MERGE_DATA[0], MERGE_DATA[1]));
        assert.isTrue( PDFTextWordMerger.canMerge(MERGE_DATA[1], MERGE_DATA[2]));
        assert.isFalse(PDFTextWordMerger.canMerge(MERGE_DATA[2], MERGE_DATA[3]));
        assert.isFalse(PDFTextWordMerger.canMerge(MERGE_DATA[3], MERGE_DATA[4]));

    });

});

const MERGE_DATA: ReadonlyArray<IPDFTextWord> = [
    {
        pageNum: 1,
        x: 122.52,
        y: 124.44000000000005,
        str: 'Bigtable:',
        width: 55.7493332,
        height: 14.3462,
    },
    {
        pageNum: 1,
        x: 182.7095,
        y: 124.44000000000005,
        str: 'A Distrib',
        width: 56.853076599999994,
        height: 14.3462,
    },
    {
        pageNum: 1,
        x: 239.3227,
        y: 124.44000000000005,
        str: 'uted',
        width: 26.9852022,
        height: 14.3462,
    },
    {
        pageNum: 1,
        x: 270.0279,
        y: 124.44000000000005,
        str: 'Storage',
        width: 46.98380499999999,
        height: 14.3462,
    },
    {
        pageNum: 1,
        x: 320.6118,
        y: 124.44000000000005,
        str: 'System',
        width: 43.885025799999994,
        height: 14.3462,
    },
    {
        pageNum: 1,
        x: 367.9769,
        y: 124.44000000000005,
        str: 'for',
        width: 17.9744528,
        height: 14.3462,
    },

];
