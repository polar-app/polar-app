import Split from 'split.js';

const INITIAL_SIZES: number[] = [70, 30];

/**
 * A simple splitter that takes to elements or selectors and makes them vertical
 * bars (one left, and one right).
 */
export class Splitter {

    private readonly left: CSSSelector | HTMLElement;
    private readonly right: CSSSelector | HTMLElement;

    private readonly split: Split.Instance;
    private readonly sidebarSide: Side;

    private collapsed: boolean = false;

    private sizes: number[];

    constructor(left: CSSSelector | HTMLElement,
                right: CSSSelector | HTMLElement,
                sidebarSide: Side = 'right') {

        this.left = left;
        this.right = right;
        this.sidebarSide = sidebarSide;

        this.split = Split([this.left, this.right], {
            sizes: INITIAL_SIZES,
            minSize: 250,
            gutterSize: 7
        });

        this.sizes = INITIAL_SIZES;

    }

    public toggle() {

        if (this.collapsed) {
            this.expand();
        } else {
            this.collapse();
        }

    }

    public collapse() {

        // update the current sizes before we collapse.
        this.sizes = this.split.getSizes();

        if (this.sidebarSide === 'left') {
            this.split.collapse(0);
        }

        if (this.sidebarSide === 'right') {
            this.split.collapse(1);
        }

        this.collapsed = true;

    }

    private expand() {

        this.split.setSizes(this.sizes);
        this.collapsed = false;

    }

}

export type Side = 'left' | 'right';

type CSSSelector = string;
