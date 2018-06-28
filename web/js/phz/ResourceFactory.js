const {Resource} = require("./Resource");
const {Hashcodes} = require("../Hashcodes");

class ResourceFactory {

    /**
     *
     * @param url {String}
     * @param contentType {String}
     * @return {Resource}
     */
    static create(url, contentType) {

        let id = Hashcodes.createID(url, 20);
        let created = new Date().toISOString();
        let meta = {};
        let headers = {};
        return new Resource({id, url, created, meta, contentType, headers});

    }

    static contentTypeToExtension(contentType) {
        if(contentType === "text/html") {
            return "html";
        } else {
            return "dat";
        }
    }

}

module.exports.ResourceFactory = ResourceFactory;
