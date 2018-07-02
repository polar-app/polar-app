/**
 * High level class representing the underlying selections without the
 * complexities and insanity of the selection API which is really rough to deal
 * with.
 */
class SelectedContent {

    constructor(obj) {

        /**
         * The text of the selected content.
         *
         * @type {String}
         */
        this.text = null;

        Object.assign(this, obj);

    }

}
