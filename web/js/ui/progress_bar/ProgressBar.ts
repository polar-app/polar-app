const ID = 'polar-progress-bar';

export class ProgressBar {

    private readonly element: HTMLProgressElement;

    constructor(element: HTMLProgressElement) {
        this.element = element;
    }

    public update(val: number) {
        this.element.value = val;
    }

    public destroy() {

        if (this.element.parentElement !== null) {
            this.element.parentElement.removeChild(this.element);
        }

    }

    public static create(indeterminate: boolean = true): ProgressBar {

        const element = document.createElement('progress');

        if (! indeterminate) {
            element.value = 0;
            element.max = 100;
        }

        element.id = ID;
        element.style.height = `5px`;
        element.style.width = `100%`;

        /// progress.style.backgroundColor='#89ADFD';
        // progress.style.color='#89ADFD';
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.left = '0';
        element.style.zIndex = '99999999999';

        document.body.appendChild(element);

        return new ProgressBar(element);

    }

}

