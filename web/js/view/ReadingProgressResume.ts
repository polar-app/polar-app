import {Arrays} from '../util/Arrays';
import {Elements} from '../util/Elements';
import {DocFormatFactory} from '../docformat/DocFormatFactory';

export class ReadingProgressResume {

    public static resume() {

        const pagemarks = Array.from(document.querySelectorAll(".page .pagemark"));
        const last = <HTMLElement> Arrays.last(pagemarks);

        if (last) {

            last.scrollIntoView({block: 'end'});

            let scrollParent = <HTMLElement> Elements.getScrollParent(last); // html mode

            const docFormat = DocFormatFactory.getInstance();

            if (docFormat.name === 'pdf') {
                scrollParent = <HTMLElement> document.querySelector("#viewerContainer");
            }

            if (scrollParent) {

                const scrollDelta = window.innerHeight * (2 / 3);
                const scrollTop = scrollParent.scrollTop;

                const newScrollTop = scrollTop + scrollDelta;

                scrollParent.scrollTop = newScrollTop;

            }

        }

    }

}
