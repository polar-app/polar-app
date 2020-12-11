import {IAnalytics, IEventArgs, IPageEvent, TraitsMap} from "../IAnalytics";
import {Heartbeats} from "polar-firebase/src/firebase/om/Heartbeats";
import {Firebase} from "../../firebase/Firebase";
import {Logger} from "polar-shared/src/logger/Logger";
import {UserTraits} from "../../datastore/firebase/UserTraits";

const log = Logger.create();

export class FirestoreAnalytics implements IAnalytics {

    public event(event: IEventArgs): void {
        // noop
    }

    public event2(event: string, data?: any): void {
        // noop
    }

    public identify(userId: string): void {
        // noop
    }

    public page(event: IPageEvent): void {
        // noop
    }

    public traits(traits: TraitsMap): void {

        UserTraits.write(traits)
                  .catch(err => console.error("Failed to write traits: ", err));

    }

    public version(version: string) {
        // noop
    }

    public heartbeat(): void {

        const doWrite = async () => {

            const uid = await Firebase.currentUserID();
            await Heartbeats.write(uid);

        };

        doWrite()
            .catch(err => log.error(err));

    }

}


