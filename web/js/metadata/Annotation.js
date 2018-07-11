const {SerializedObject} = require("./SerializedObject.js");
const {VersionedObject} = require("./VersionedObject");
const {ISODateTime} = require("./ISODateTime");

// FIXME: move to extend VersionedObject

/* abstract */
class Annotation extends VersionedObject {

    constructor(val) {

        super(val);

        this.init(val);

    }

};


module.exports.Annotation = Annotation
