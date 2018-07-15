const {AbstractPagemarkComponent} = require("./AbstractPagemarkComponent");

/**
 * A pagemark for thumbnails.
 */
class ThumbnailPagemarkComponent extends AbstractPagemarkComponent {

    constructor() {
        super("thumbnail");
    }

    /**
     *
     * @param annotationEvent {AnnotationEvent}
     */
    init(annotationEvent) {

        super.init(annotationEvent);

        let container = annotationEvent.container;
        //let templateElement = container.element.querySelector(".thumbnailImage");

        let templateElement = container.element;

        if( ! templateElement) {
            console.warn("Thumbnail tab may not be visible in", container);
            // the thumbnail tab might not be visible.
            return;
        }

        this.options.templateElement = templateElement;
        this.options.placementElement = templateElement;

    }

}

module.exports.ThumbnailPagemarkComponent = ThumbnailPagemarkComponent;
