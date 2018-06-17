const featherlight = require('featherlight');

class Modal {

    static create(element) {
        $.featherlight($(element).show());
    }

}

module.exports.Modal = Modal;
