/**
 *
 */
const {ContainerLifecycleListener} = require("../ContainerLifecycleListener");

/**
 * Listens to the lifecycle of .page
 */
class ThumbnailContainerLifecycleListener extends ContainerLifecycleListener {

    constructor(thumbnailElement) {
        super();
        this.thumbnailElement = thumbnailElement;
        this.listener = null;

    }

    register(callback) {

        this.listener = event => {

            if (event.target && event.target.className === "thumbnailImage") {
                callback(this.pageElement);
            }

        };

        let mutatingElement = this.thumbnailElement.querySelector(".thumbnailSelectionRing");

        mutatingElement.addEventListener('DOMNodeInserted', this.listener, false);

    };

    unregister() {
        this.pageElement.removeEventListener('DOMNodeInserted', this.listener, false);
        this.listener = null;
    }

}

module.exports.ThumbnailContainerLifecycleListener = ThumbnailContainerLifecycleListener;
