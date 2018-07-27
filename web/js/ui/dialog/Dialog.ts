declare var global: any;
global.$ = global.jQuery = require("jquery");
require("jquery-ui-bundle");

/**
 * Dialog box for entering data in the UI.
 */
export class Dialog {

    private readonly target: any;

    public width: number = 250;
    public height: number = 250;

    /**
     *
     * @param target An HTML element or CSS selector.
     */
    constructor(target: any) {
        this.target = target;
    }

    show(): void {

        $(() => {
            $(this.target)
                .dialog({
                    width: this.width,
                    height: this.height
                })
                .show();
        });

    }

    hide(): void {
        $(this.target).hide();
    }

}
