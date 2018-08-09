import $ from '../ui/JQuery';

export class Viewer {

    start() {

        $(document).ready(() => {

        });

    }

    changeScale(scale: number) {
        throw new Error("Not supported by this viewer.")
    }

}
