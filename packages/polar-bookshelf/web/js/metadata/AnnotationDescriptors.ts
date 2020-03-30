import {AnnotationDescriptor} from './AnnotationDescriptor';
import {AnnotationTypes} from './AnnotationTypes';
import {Attributes} from '../util/Attributes';

export class AnnotationDescriptors {

    public static createFromElement(element: HTMLElement): AnnotationDescriptor | undefined {

        const dataAttributes = Attributes.dataToStringMap(element);

        if (! dataAttributes['annotationType']) {
            return undefined;
        }

        let annotationTypeStr = dataAttributes['annotationType'].replace("-", "_").toUpperCase();

        let annotationType = AnnotationTypes.fromString(annotationTypeStr);
        let id = dataAttributes['annotationId'];
        let docFingerprint = dataAttributes['annotationDocFingerprint'];
        let pageNum = parseInt(dataAttributes['annotationPageNum']);

        return AnnotationDescriptor.newInstance(annotationType, id, docFingerprint, pageNum);

    }

    public static createFromObject(obj: any): AnnotationDescriptor {

        const result = new AnnotationDescriptor(<AnnotationDescriptor> obj);

        return Object.freeze(result);

    }

}
