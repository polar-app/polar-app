import {TagOption} from './TagOption';
import {Tag} from 'polar-shared/src/tags/Tags';

export class TagOptions {

    public static toTags(tagOptions: TagOption[]): Tag[] {

        return tagOptions.map((current): Tag => {

            return {
                id: current.value,
                label: current.label
            };

        });

    }

    public static fromTags(tags: ReadonlyArray<Tag>, noSort: boolean = false): TagOption[] {

        const tagOptions = tags.map(current => {
            return {
                value: current.id,
                label: current.label
            };
        });

        if (noSort) {
            return tagOptions;
        }

        return tagOptions.sort((a, b) => a.label.localeCompare(b.label));

    }

}
