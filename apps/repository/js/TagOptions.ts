import {TagOption} from './TagOption';
import {Tag} from 'polar-shared/src/tags/Tags';

export class TagOptions {

    public static toTags(tagOptions: ReadonlyArray<TagOption>): ReadonlyArray<Tag> {

        tagOptions = tagOptions || [];

        return tagOptions.map((current): Tag => {

            return {
                id: current.value,
                label: current.label
            };

        });

    }

    public static fromTags(tags: ReadonlyArray<Tag>, noSort: boolean = false): ReadonlyArray<TagOption> {

        tags = tags || [];

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
