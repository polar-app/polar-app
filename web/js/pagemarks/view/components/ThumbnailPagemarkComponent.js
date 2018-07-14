const {AbstractPagemarkComponent} = require("./AbstractPagemarkComponent");

/**
 * A pagemark for thumbnails.
 */
class ThumbnailPagemarkComponent extends AbstractPagemarkComponent {

    /**
     *
     * @param annotationEvent {AnnotationEvent}
     */
    init(annotationEvent) {

        super.init(annotationEvent);

        let templateElement = annotationEvent.container.querySelector(".thumbnailImage");

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
