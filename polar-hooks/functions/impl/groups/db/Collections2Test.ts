import {Collections, OrderByClause} from "polar-firebase/src/firebase/Collections";
import {Firestore} from "../../util/Firestore";

xdescribe('Collections', function() {

    it("basic", async function() {

        const firestore = Firestore.getInstance();
        const collections = new Collections(firestore);

        const groups = await collections.list('group', [['visibility', '==', 'public']]);

    });

    it("iterator", async function() {

        const firestore = Firestore.getInstance();
        const collections = new Collections(firestore);

        const orderBy: ReadonlyArray<OrderByClause> = [
            ['created', 'asc'],
            ['id', 'asc'],
        ];

        const iterator = await collections.iterate('group', [['visibility', '==', 'public']], {orderBy, limit: 2});

        while(iterator.hasNext()) {
            const page = await iterator.next();
            console.log(page);
        }

    });

});
