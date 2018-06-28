
class ContentTypes {

    static contentTypeToExtension(contentType) {
        if(contentType === "text/html") {
            return "html";
        } else {
            return "dat";
        }
    }

}

module.exports.ContentTypes = ContentTypes;
