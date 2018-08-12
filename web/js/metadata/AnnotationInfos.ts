import {AnnotationInfo} from './AnnotationInfo';

export class AnnotationInfos {

    public static create() {

        let result: AnnotationInfo = Object.create(AnnotationInfo.prototype);
        result.init(result);

        return result;

    }


}
