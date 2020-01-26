import {AutoPagemarker, ExtendPagemark, PageID} from "./AutoPagemarker";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Page, View, Viewport, ViewVisibility, ViewVisibilityCalculator} from "./ViewVisibilityCalculator";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {assertJSON} from "polar-test/src/test/Assertions";
import {Numbers} from "polar-shared/src/util/Numbers";

const PAGE_HEIGHT = 1100;

const createViewportForPage = (page: PageID): Viewport => {

    const bottom = (page * PAGE_HEIGHT);
    const top = bottom - PAGE_HEIGHT;

    return {top, bottom};

};

const createView = (viewport: Viewport,
                    nrPages: number): View => {

    const createPage = (page: number): Page => {

        const bottom = (page * PAGE_HEIGHT);
        const top = bottom - PAGE_HEIGHT;

        return {
            id: page,
            top, bottom
        };

    };

    const pages = Numbers.range(1, nrPages)
                    .map(createPage);

    return {
        viewport,
        pages
    };

};

const createViewVisibility = (viewport: Viewport,
                              nrPages: number): ViewVisibility => {

    const view = createView(viewport, nrPages);

    return ViewVisibilityCalculator.calculate(view);

};

interface TestResult {
    extendPagemark: ExtendPagemark;
}

type Tester = (viewport: Viewport, expected: any) => TestResult;

const createTester = (nrPages: number = 10): Tester => {

    let extendPagemark: ExtendPagemark | undefined;

    // tslint:disable-next-line:variable-name
    const pagemarker = new AutoPagemarker(_extendPagemark => extendPagemark = _extendPagemark);

    return (viewport: Viewport, expected: any) => {

        const viewVisibility = createViewVisibility(viewport, nrPages);

        const result = pagemarker.compute(viewVisibility);

        assertJSON(result, expected);

        return {
            extendPagemark: extendPagemark!
        };

    };

};

describe('AutoPagemarker', function() {

    beforeEach(() => {
        TestingTime.freeze();
    });

    afterEach(() => {
        TestingTime.unfreeze();
    });

    it("basic fully visible", function () {

        // TODO/FIXME: rework this text by creating the raw pages,
        // then moving the viewpoint and then using the
        // ViewCalculator

        const viewport: Viewport = {
            top: 0,
            bottom: 1100
        };

        const pagemarked = new AutoPagemarker(NULL_FUNCTION);

        const viewVisibility = createViewVisibility(viewport, 2);

        const result = pagemarked.compute(viewVisibility);

        assertJSON(result, {
            "position": {
                "created": 1330688329321,
                "origin": 1,
                "pageVisibility": {
                    "bottom": 1100,
                    "id": 1,
                    "perc": 1,
                    "top": 0
                },
                "updated": 1330688329321
            },
            "strategy": "init"
        });

    });

    it("two half visible", function () {

        const doTest = createTester();

        doTest(
            {
                top: 0,
                bottom: 1100
            },
            {
                "position": {
                    "created": 1330688329321,
                    "origin": 1,
                    "pageVisibility": {
                        "bottom": 1100,
                        "id": 1,
                        "perc": 1,
                        "top": 0
                    },
                    "updated": 1330688329321
                },
                "strategy": "init"
            });

        TestingTime.forward('15s');

        doTest(
            {
                top: 500,
                bottom: 1600
            },
            {
                "position": {
                    "created": 1330688329321,
                    "origin": 1,
                    "pageVisibility": {
                        "bottom": 1100,
                        "id": 1,
                        "perc": 0.5454545454545454,
                        "top": 0
                    },
                    "updated": 1330688344321
                },
                "strategy": "updated"
            }
        );

        TestingTime.forward('15s');

        const testResult = doTest(
            {
                top: 1100,
                bottom: 2200
            },
            {
                "pagemarked": 1,
                "position": {
                    "created": 1330688329321,
                    "origin": 1,
                    "pageVisibility": {
                        "bottom": 2200,
                        "id": 2,
                        "perc": 1,
                        "top": 1100
                    },
                    "updated": 1330688359321
                },
                "strategy": "created"
            }
        );

        assertJSON(testResult.extendPagemark, {origin: 1, page: 1, perc: 100});

    });

    it("page 1, then jump, then scroll, to see if origin is right.", function () {

        const doTest = createTester();

        doTest(
            createViewportForPage(1),
            {
                "position": {
                    "created": 1330688329321,
                    "origin": 1,
                    "pageVisibility": {
                        "bottom": 1100,
                        "id": 1,
                        "perc": 1,
                        "top": 0
                    },
                    "updated": 1330688329321
                },
                "strategy": "init"
            });

        TestingTime.forward('15s');

        doTest(
            createViewportForPage(5),
            {
                "position": {
                    "created": 1330688344321,
                    "origin": 5,
                    "pageVisibility": {
                        "bottom": 5500,
                        "id": 5,
                        "perc": 1,
                        "top": 4400
                    },
                    "updated": 1330688344321
                },
                "strategy": "jumped"
            }
        );

        TestingTime.forward('15s');

        const testResult = doTest(
            createViewportForPage(6),
            {
                "pagemarked": 5,
                "position": {
                    "created": 1330688344321,
                    "origin": 5,
                    "pageVisibility": {
                        "bottom": 6600,
                        "id": 6,
                        "perc": 1,
                        "top": 5500
                    },
                    "updated": 1330688359321
                },
                "strategy": "created"
            }
        );

        assertJSON(testResult.extendPagemark, {origin: 5, page: 5, perc: 100});

        const testResult1 = doTest(
            createViewportForPage(7),
            {
                "pagemarked": 6,
                "position": {
                    "created": 1330688344321,
                    "origin": 5,
                    "pageVisibility": {
                        "bottom": 7700,
                        "id": 7,
                        "perc": 1,
                        "top": 6600
                    },
                    "updated": 1330688359321
                },
                "strategy": "created"
            }
        );

        assertJSON(testResult1.extendPagemark, {origin: 5, page: 6, perc: 100});

    });

});
