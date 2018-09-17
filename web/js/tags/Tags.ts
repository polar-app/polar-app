import twitter_txt from 'twitter-text';
import {isPresent} from '../Preconditions';
import {Optional} from '../util/ts/Optional';
import {Tag} from './Tag';

export class Tags {

    public static assertValid(label: string) {

        if (! this.validate(label).isPresent()) {
            throw new Error("Invalid tag: " + label);
        }

    }

    public static validate(label: string): Optional<string> {

        if (! isPresent(label)) {
            return Optional.empty();
        }

        if (! label.startsWith('#')) {
            label = '#' + label;
        }

        if (twitter_txt.isValidHashtag(label)) {
            return Optional.of(label);
        }

        return Optional.empty();

    }

    public static toMap(tags: Tag[]) {

        const result: {[id: string]: Tag} = {};

        for (const tag of tags) {
            result[tag.id] = tag;
        }

        return result;

    }

}

