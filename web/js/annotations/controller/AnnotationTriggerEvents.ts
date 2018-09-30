/**
 * Helper class to work with TriggerEvents for annotations.
 */
import {TriggerEvent} from '../../contextmenu/TriggerEvent';
import {AnnotationDescriptor} from '../../metadata/AnnotationDescriptor';

export class AnnotationTriggerEvents {

    public static getAnnotationDescriptors(triggerEvent: TriggerEvent) {

        const annotationDescriptors: AnnotationDescriptor[] = [];

        annotationDescriptors.push(...triggerEvent.matchingSelectors['.text-highlight'].annotationDescriptors);
        annotationDescriptors.push(...triggerEvent.matchingSelectors['.area-highlight'].annotationDescriptors);
        annotationDescriptors.push(...triggerEvent.matchingSelectors['.page'].annotationDescriptors);

        return annotationDescriptors;

    }

}
