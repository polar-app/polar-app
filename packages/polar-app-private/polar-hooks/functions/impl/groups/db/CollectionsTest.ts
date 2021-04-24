import {Collections, OrderByClause} from "polar-firebase/src/firebase/Collections";
import {Firestore} from "../../util/Firestore";

xdescribe('Collections', function() {

    it("basic", async function() {

        const firestore = Firestore.getInstance();
        const collections = new Collections(firestore, 'group');

        const groups = await collections.list([['visibility', '==', 'public']]);

    });

    it("iterator", async function() {

        const firestore = Firestore.getInstance();
        const collections = new Collections(firestore, 'group');

        const orderBy: ReadonlyArray<OrderByClause> = [
            ['created', 'asc'],
            ['id', 'asc'],
        ];

        const iterator = await collections.iterate([['visibility', '==', 'public']], {orderBy, limit: 2});

        while (iterator.hasNext()) {
            const page = await iterator.next();
            console.log(page);
        }

    });

});
