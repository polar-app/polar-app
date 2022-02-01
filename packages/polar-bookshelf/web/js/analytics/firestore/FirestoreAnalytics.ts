import {IAnalytics, IAnalyticsUser, IEventArgs, IPageEvent, TraitsMap} from "../IAnalytics";
import {HeartbeatCollection} from "polar-firebase/src/firebase/om/HeartbeatCollection";
import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {UserTraits} from "../../datastore/firebase/UserTraits";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";


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

            const firestore = await FirestoreBrowserClient.getInstance();

            const uid = await FirebaseBrowser.currentUserID();

            if (!uid) return;

            await HeartbeatCollection.write(firestore, uid);

        };

        doWrite()
            .catch(err => console.error(err));

    }

    public logout(): void {
    }

}


