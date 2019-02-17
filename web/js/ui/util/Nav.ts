export class Nav {

    public static createHashURL(hash: string) {
        const url = new URL(window.location.href);
        url.hash = hash;
        return url.toString();
    }

    public static openLinkWithNewTab(link: string) {

        const win = window.open(link, '_blank');

        if (win) {
            win.focus();
        }

    }

}
