import {Toaster} from "../../../web/js/ui/toaster/Toaster";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

export class TagInputs {

    public static validate(tags: ReadonlyArray<Tag>) {

        const invalidTags = Tags.findInvalidTags(...tags);

        if (invalidTags.length !== 0) {

            const invalidTagsStr =
                invalidTags.map(current => current.label)
                    .join(", ");

            Toaster.warning("Some tags were excluded - spaces and other control characters not supported: " + invalidTagsStr, "Invalid tags");

            log.warn("Some tags were invalid", invalidTags);

        }

    }

}
