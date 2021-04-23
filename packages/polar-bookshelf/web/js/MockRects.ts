import {Rects} from './Rects';

export const MOCK_RECTS: any = {

    not_intersected: {

        rect0: Rects.createFromBasicRect({
            left: 100,
            top: 100,
            width: 100,
            height: 100
        }),

        rect1: Rects.createFromBasicRect({
            left: 300,
            top: 300,
            width: 100,
            height: 100
        })

    },

    basic_test: {

        rect0: Rects.createFromBasicRect({
            left: 301,
            top: 137,
            right: 501,
            bottom: 337,
            width: 200,
            height: 200
        }),

        rect1: Rects.createFromBasicRect({
            left: 400,
            top: 150,
            right: 500,
            bottom: 250,
            width: 100,
            height: 100
        })

    },

    intersected_right: {

        rect0: Rects.createFromBasicRect({
            left: 100,
            top: 100,
            width: 100,
            height: 100
        }),

        rect1: Rects.createFromBasicRect({
            left: 150,
            top: 100,
            width: 100,
            height: 100
        })

    },

    intersected_left: {

        rect0: Rects.createFromBasicRect({
            left: 100,
            top: 100,
            width: 100,
            height: 100
        }),

        rect1: Rects.createFromBasicRect({
            left: 50,
            top: 100,
            width: 100,
            height: 100
        })

    },

    intersected_top: {

        rect0: Rects.createFromBasicRect({
            left: 100,
            top: 100,
            width: 100,
            height: 100
        }),

        rect1: Rects.createFromBasicRect({
            left: 100,
            top: 50,
            width: 100,
            height: 100
        })

    },

    intersected_bottom: {

        rect0: Rects.createFromBasicRect({
            left: 100,
            top: 100,
            width: 100,
            height: 100
        }),

        rect1: Rects.createFromBasicRect({
            left: 100,
            top: 150,
            width: 100,
            height: 100
        })

    },

    intersected_bottom_left: {

        rect0: Rects.createFromBasicRect({
            left: 100,
            top: 100,
            width: 100,
            height: 100
        }),

        rect1: Rects.createFromBasicRect({
            left: 50,
            top: 150,
            width: 100,
            height: 100
        })

    },

    overlap_rect0_over_rect1: {

        rect0: Rects.createFromBasicRect({
            left: 5,
            top: 5,
            width: 30,
            height: 30
        }),

        rect1: Rects.createFromBasicRect({
            left: 10,
            top: 10,
            width: 10,
            height: 10
        })

    },

    resize_from_right: {

        resizeRect: Rects.createFromBasicRect({
            left: 10,
            top: 0,
            width: 20,
            height: 20
        }),

        intersectedRect: Rects.createFromBasicRect({
            left: 5,
            top: 0,
            width: 10,
            height: 10
        })

    },

    resize_from_right_with_overlap: {

        resizeRect: Rects.createFromBasicRect({
            left: 2,
            top: 0,
            width: 20,
            height: 20
        }),

        intersectedRect: Rects.createFromBasicRect({
            left: 5,
            top: 0,
            width: 10,
            height: 10
        })

    },

    resize_placed_top_right_resizing_left_bottom: {

        resizeRect: Rects.createFromBasicRect({
            left: 0,
            top: 10,
            width: 10,
            height: 10
        }),

        intersectedRect: Rects.createFromBasicRect({
            left: 1,
            top: 0,
            width: 11,
            height: 11
        })

    }


};
