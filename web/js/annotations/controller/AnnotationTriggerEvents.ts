/**
 * Helper class to work with TriggerEvents for annotations.
 */
import {TriggerEvent} from '../../contextmenu/TriggerEvent';
import {AnnotationDescriptor} from '../../metadata/AnnotationDescriptor';

export class AnnotationTriggerEvents {

    static getAnnotationDescriptors(triggerEvent: TriggerEvent) {

        let annotationDescriptors: AnnotationDescriptor[] = [];

        annotationDescriptors.push(...triggerEvent.matchingSelectors['.text-highlight'].annotationDescriptors);
        annotationDescriptors.push(...triggerEvent.matchingSelectors['.area-highlight'].annotationDescriptors);
        annotationDescriptors.push(...triggerEvent.matchingSelectors['.page'].annotationDescriptors);

        return annotationDescriptors;

    }

}
