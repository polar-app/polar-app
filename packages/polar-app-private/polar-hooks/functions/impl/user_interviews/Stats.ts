import {UserPager} from "./UserPager";
import {UserPredicate, UserPredicates} from "./UserInterviewer";

export class Stats {

    public static async exec() {

        const userPager = new UserPager();

        const stats = {
            veterans: 0,
            recent: 0,
        };

        while (await userPager.hasNext()) {

            const userRecords = await userPager.next();

            const veterans = userRecords.filter(UserPredicates.get('veteran'));
            const recent = userRecords.filter(UserPredicates.get('recent'));

            stats.veterans += veterans.length;
            stats.recent += recent.length;

            console.log('stats: ' , stats);

        }

        console.log("====");
        console.log('stats: ' , stats);

    }

}
