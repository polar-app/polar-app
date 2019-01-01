const ID = 'polar-progress-bar';

/**
 * Simple progress bar that we can display at any time on a page without
 * complicated rendering issues or requiring React to be used.  This allows
 * us to easily show a GUI for a download at any point in time.
 */
export class ProgressBar {

    private readonly element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    public update(val: number) {

        if (this.element instanceof HTMLProgressElement) {
            this.element.tags = val;
        }

    }

    public destroy() {

        if (this.element.parentElement !== null) {
            this.element.parentElement.removeChild(this.element);
        }

    }

    public static create(indeterminate: boolean = true): ProgressBar {

        let element: HTMLElement;

        if (indeterminate) {

            element = document.createElement('div');

            element.setAttribute('class', 'progress-indeterminate-slider');

            element.innerHTML = `
                <div class="progress-indeterminate-line"></div>
                <div class="progress-indeterminate-subline progress-indeterminate-inc"></div>
                <div class="progress-indeterminate-subline progress-indeterminate-dec"></div>
            `;

        } else {
            element = document.createElement('progress');
        }

        if (! indeterminate && element instanceof HTMLProgressElement) {
            // set the defaults
            element.value = 0;
            element.max = 100;
        }

        element.id = ID;

        element.style.height = '4px';

        element.style.width = `100%`;

        /// progress.style.backgroundColor='#89ADFD';
        // progress.style.color='#89ADFD';
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.left = '0';
        element.style.zIndex = '99999999999';
        element.style.borderTop = '0';
        element.style.borderLeft = '0';
        element.style.borderRight = '0';
        element.style.borderBottom = '0';
        // element.style.webkitAppearance = 'none';
        // element.style.borderRadius = '0';

        document.body.appendChild(element);

        return new ProgressBar(element);

    }

}

