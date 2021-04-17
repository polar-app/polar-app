import {Clause, Collections} from "../../impl/groups/db/Collections";
import {Lazy} from "../../impl/util/Lazy";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

interface IUserTrait {
    readonly name: string;
    readonly value: string;
    readonly uid: string;
}

async function getUserTraitsForProfessors(): Promise<ReadonlyArray<IUserTrait>> {

    // protected and private groups can not have names and these must be public.
    const clauses: ReadonlyArray<Clause> = [
        ['value', '==' , 'professor'],
    ];

    return Collections.list('user_trait', clauses);

}

async function userTraits(uid: string) {

    // protected and private groups can not have names and these must be public.
    const clauses: ReadonlyArray<Clause> = [
        ['uid', '==' , uid],
    ];

    const list = await Collections.list<IUserTrait>('user_trait', clauses);

    return arrayStream(list).toMap(current => current.name);

}

const firebaseProvider = Lazy.create(() => FirebaseAdmin.app());

async function exec() {

    const firebase = firebaseProvider();

    const auth = firebase.auth();

    const traits = await getUserTraitsForProfessors();

    for (const current of traits) {

        // console.log("uid: " + current.uid);
        const user = await auth.getUser(current.uid);
        const creationTime = new Date(user.metadata.creationTime)

        const traitsForUser = await userTraits(user.uid);

         // user_university_name_slug // user_university_domain // user_field_of_study

        const universityNameSlug = traitsForUser.user_university_name_slug.value;
        const universityDomain = traitsForUser.user_university_domain.value;
        const fieldOfStudy = traitsForUser.user_field_of_study.value;

        console.log(`${user.email} ${creationTime.toISOString()} ${fieldOfStudy} ${universityNameSlug} ${universityDomain}`);

    }

}

exec()
    .catch(err => console.error(err));
