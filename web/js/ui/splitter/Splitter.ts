import Split from 'split.js';

/**
 * A simple splitter that takes to elements or selectors and makes them vertical
 * bars (one left, and one right).
 */
export class Splitter {

    private readonly left: CSSSelector | HTMLElement;
    private readonly right: CSSSelector | HTMLElement;

    private split: Split.Instance;

    constructor(left: CSSSelector | HTMLElement, right: CSSSelector | HTMLElement) {
        this.left = left;
        this.right = right;

        this.split = Split([this.left, this.right], {
            sizes: [50, 50],
            minSize: 100,
            gutterSize: 7
        });

    }

    public collapse(side: Side) {

        if (side === 'left') {
            this.split.collapse(0);
        }

        if (side === 'right') {
            this.split.collapse(1);
        }

    }

}

type Side = 'left' | 'right';

type CSSSelector = string;
