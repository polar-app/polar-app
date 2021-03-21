import {RelatedTagsManager} from "../../../../../web/js/tags/related/RelatedTagsManager";
import { FluidElementPredicates } from "./FluidElementPredicates";

describe('FluidElementPredicates', function() {

    xit("basic", function() {

        const boxRect = {
            bottom: 700.640625,
            top: 0
        };

        const elements = [
            {
                "idx": 0,
                "offsetTop": 20,
                "offsetHeight": 28
            },
            {
                "idx": 1,
                "offsetTop": 61,
                "offsetHeight": 31
            },
            {
                "idx": 2,
                "offsetTop": 69,
                "offsetHeight": 15
            },
            {
                "idx": 3,
                "offsetTop": 183,
                "offsetHeight": 54
            },
            {
                "idx": 4,
                "offsetTop": 249,
                "offsetHeight": 54
            },
            {
                "idx": 5,
                "offsetTop": 315,
                "offsetHeight": 90
            },
            {
                "idx": 6,
                "offsetTop": 315,
                "offsetHeight": 18
            },
            {
                "idx": 7,
                "offsetTop": 315,
                "offsetHeight": 18
            },
            {
                "idx": 8,
                "offsetTop": 351,
                "offsetHeight": 18
            },
            {
                "idx": 9,
                "offsetTop": 417,
                "offsetHeight": 18
            },
            {
                "idx": 10,
                "offsetTop": 447,
                "offsetHeight": 36
            },
            {
                "idx": 11,
                "offsetTop": 2,
                "offsetHeight": 650
            },
            {
                "idx": 12,
                "offsetTop": 2,
                "offsetHeight": 650
            },
            {
                "idx": 13,
                "offsetTop": 13,
                "offsetHeight": 228
            },
            {
                "idx": 14,
                "offsetTop": 13,
                "offsetHeight": 162
            },
            {
                "idx": 15,
                "offsetTop": 187,
                "offsetHeight": 54
            }
        ];

        const predicate = FluidElementPredicates.create('bottom', boxRect);

        // const selected = predicate.select(elements);

        // console.log(selected);

    });

});
