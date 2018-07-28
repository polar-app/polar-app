import ReactSummernote from './ReactSummernote';
import {TextWidget} from './TextWidget';

export class SchemaUIFactory {

    static create(): any {

        return {

            front: {
                "ui:widget": TextWidget,
            },
            // back: {
            //     "ui:widget": RichTextWidget,
            // }

        };

    }

}
