import {IAnalytics, IAnalyticsUser, IEventArgs, IPageEvent, TraitsMap} from "../IAnalytics";
import {Heartbeats} from "polar-firebase/src/firebase/om/Heartbeats";
import {Firebase} from "../../firebase/Firebase";
import {Logger} from "polar-shared/src/logger/Logger";
import {UserTraits} from "../../datastore/firebase/UserTraits";

const log = Logger.create();

export class FirestoreAnalytics implements IAnalytics {

    public event(event: IEventArgs): void {
        const name = `${event.category}/${event.action}`;
        // Events.write(name, standardEventProperties)
        //     .catch(err => console.error("Unable to write event: " + name, err));
    }

    public event2(event: string, data?: any): void {
        // Events.write(event, {...data, ...standardEventProperties})
        //     .catch(err => console.error("Unable to write event: " + name, err));
    }

    public identify(user: IAnalyticsUser): void {
        // noop
    }

    public page(event: IPageEvent): void {
        this.event2('pageView', event);
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

    public logout(): void {
    }

}


