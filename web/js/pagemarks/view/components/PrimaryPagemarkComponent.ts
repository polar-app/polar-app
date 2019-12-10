import {AbstractPagemarkComponent} from './AbstractPagemarkComponent';

/**
 * The primary pagemark for displaying pagemarks on a .page.  This is in contrast
 * to a thumbnail pagemark.
 */
export class PrimaryPagemarkComponent extends AbstractPagemarkComponent {

    constructor() {
        super("primary");
    }

}
