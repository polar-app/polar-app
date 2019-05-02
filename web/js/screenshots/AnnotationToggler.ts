import {AnnotationStyle} from './electron/ElectronScreenshots';
import {StyleRestore} from './electron/ElectronScreenshots';

export class AnnotationToggler {

    private SELECTOR = ".page .pagemark, .page .text-highlight, .page .area-highlight";

    private annotationStyles: AnnotationStyle[] = [];

    private getAnnotationElements(): ReadonlyArray<HTMLElement> {
        return Array.from(document.querySelectorAll(this.SELECTOR));
    }

    public hide() {

        for (const annotationElement of this.getAnnotationElements()) {

            const styleRestore: StyleRestore = {
                visibility: annotationElement.style.visibility
            };

            annotationElement.style.visibility = 'hidden';

            this.annotationStyles.push({element: annotationElement, styleRestore});

        }

    }

    public show() {

        for (const annotationStyle of this.annotationStyles) {

            annotationStyle.element.style.visibility =
                annotationStyle.styleRestore.visibility;

        }

    }

}

