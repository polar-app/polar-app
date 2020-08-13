import {IAnalytics, IEventArgs, TraitsMap} from "../IAnalytics";
import {Heartbeats} from "polar-firebase/src/firebase/om/Heartbeats";
import {Firebase} from "../../firebase/Firebase";
import {Logger} from "polar-shared/src/logger/Logger";

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

    public page(name: string): void {
        // noop
    }

    public traits(traits: TraitsMap): void {
        // noop
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


