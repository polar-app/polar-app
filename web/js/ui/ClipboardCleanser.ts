/**
 * Keeps track of the last copy the user did so that we can then request what
 * was copied.
 */

export class ClipboardCleanser {

    public static register() {

        document.addEventListener('cut', event => this.handleEvent(event));
        document.addEventListener('copy', event => this.handleEvent(event));

    }

    private static handleEvent(event: ClipboardEvent) {

        if (!event.clipboardData) {
            return;
        }

        console.log("FIXME000: ", [...event.clipboardData.types]);

        console.log("FIXME00: ", event.clipboardData.getData('text/plain'));
        console.log("FIXME01: ", event.clipboardData.getData('text/html'));

        const html = event.clipboardData.getData('text/html');
        const cleansed = this.cleanse(html);
        console.log("FIXME: cleansed: ", cleansed);

        event.clipboardData.setData('text/html', "asdf");

        // This is necessary to prevent the current document selection from
        // being written to the clipboard.
        event.preventDefault();

    }

    private static cleanse(html: string) {
        console.log("FIXME1, ", html);

        const div = document.createElement('div');
        div.innerHTML = html;

        console.log("FIXME2, ", div);
        console.log("FIXME3, ", div.outerHTML);
        console.log("FIXME4, ", div.innerText);

        return div.innerText;
    }

}
