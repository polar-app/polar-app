import {BaseType} from "./BaseType";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Profile} from "../../../groups/db/Profiles";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {IImageObject, ImageObjects} from "./ImageObject";
import {URLStr} from "polar-shared/src/util/Strings";

export interface IPersonInit {

    readonly name: string;
    readonly identifier?: string;
    readonly image?: URLStr | IImageObject;

}

export interface IPerson extends IPersonInit, BaseType {


}

export class Persons {

    public static convert(profile: Profile | undefined) {

        // TODO: create a profile URL and include this so that everyone
        // has their own profile page.  We can do this if the user has a
        // 'handle'

        // TODO: use an identifier here too which is the handle since it's
        // unique across the service

        if (! profile) {
            return ANONYMOUS_PERSON;
        }

        const createImageObject = (): IImageObject | undefined => {

            if (profile.image) {

                const {width, height} = profile.image.size ?
                                            profile.image.size :
                                            {width: undefined, height: undefined};

                return ImageObjects.create({url: profile.image.url, width, height})

            }

            return undefined;

        };

        const image = createImageObject();

        const identifier = profile.handle;

        if (profile.name) {
            return this.create({name: profile.name, identifier, image});
        }

        if (profile.handle) {
            return this.create({name: profile.handle, identifier, image});
        }

        return ANONYMOUS_PERSON;

    }

    public static create(init: IPersonInit): IPerson {

        return Dictionaries.onlyDefinedProperties({
            "@type": "Person",
            ...init
        });

    }

}

export const ANONYMOUS_PERSON = Persons.create({
    name: "anonymous"
});
