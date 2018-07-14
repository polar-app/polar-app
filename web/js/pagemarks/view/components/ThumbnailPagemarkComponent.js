const {AbstractPagemarkComponent} = require("./AbstractPagemarkComponent");

/**
 * A pagemark for thumbnails.
 */
class ThumbnailPagemarkComponent extends AbstractPagemarkComponent {

    init(annotationEvent) {

        // FIXME: __requiresPagemark needs to be used ... we're not ALWAYS rendering these.
        // Maybe refactor it to visible()

        //
        // __registerListener is different too.. it's listening to a different element


        super.init(annotationEvent);

        let templateElement = annotationEvent.pageElement.querySelector(".thumbnailImage");

        if( ! templateElement) {
            console.warn("Thumbnail tab may not be visible.");
            // the thumbnail tab might not be visible.
            return;
        }

        this.options.templateElement = templateElement;
        this.options.placementElement = placementElement;

    }

}

module.exports.ThumbnailPagemarkComponent = ThumbnailPagemarkComponent;
