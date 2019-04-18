import {TagSelectOption} from './TagSelectOption';
import {Tag} from '../../../web/js/tags/Tag';

export class TagSelectOptions {

    public static toTags(tagSelectOptions: TagSelectOption[]): Tag[] {

        return tagSelectOptions.map((current): Tag => {

            return {
                id: current.value,
                label: current.label
            };

        });

    }

    public static fromTags(tags: Tag[]): TagSelectOption[] {

        return tags.map( current => {
                   return {
                       value: current.id,
                       label: current.label
                   };
               })
               .sort((a, b) => a.label.localeCompare(b.label));

    }

}
