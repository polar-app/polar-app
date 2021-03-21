import { Graphs } from "./Graph";
import { Articles } from "./Article";
import { Comments, IComment } from "./Comment";
import {Persons} from "./Person";

describe('JSONLD', function() {

    it("basic", function() {

        const graph = Graphs.create([
            Articles.create({
                "@id": "/articles/foobar",
                url: 'https://exemple.com/article?id=1234',
                author: Persons.create({name: "Alice"}),
                description: "This is a descrription of my page",
                image : "https://exemple.com/article.jpg",
                mainEntityOfPage : "https://example.com",
                headline: 'my article',
                text: 'blah blah',
                commentCount: 2,
                // FIXME publisher as an organization.
            }),
            Comments.create({
                author: Persons.create({name: "Alice"}),
                text: "first comment",
                dateCreated: "2018-06-14T21:40:00+02:00",
                "@reverse": {
                    comment: {"@id": "/articles/foobar"}
                }
            })
        ]);

        console.log(JSON.stringify(graph, null, "  "));

    });

});
