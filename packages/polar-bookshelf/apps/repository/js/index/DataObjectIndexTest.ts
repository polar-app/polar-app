import {Tag} from 'polar-shared/src/tags/Tags';
import {DataObjectIndex} from './DataObjectIndex';
import {Tags} from 'polar-shared/src/tags/Tags';
import {assertJSON} from '../../../../web/js/test/Assertions';

describe('DataObjectIndex', function() {

    it("basic", function() {

        const index = new DataObjectIndex<Person>((p?: Person) => p!.tags);

        index.put('alice', {name: 'alice', tags: [Tags.create('nice'), Tags.create('happy')]});
        index.put('bob', {name: 'bob', tags: [Tags.create('mean'), Tags.create('bad')]});

        assertJSON(index.values(), [
            {
                "name": "alice",
                "tags": [
                    {
                        "id": "nice",
                        "label": "nice"
                    },
                    {
                        "id": "happy",
                        "label": "happy"
                    }
                ]
            },
            {
                "name": "bob",
                "tags": [
                    {
                        "id": "mean",
                        "label": "mean"
                    },
                    {
                        "id": "bad",
                        "label": "bad"
                    }
                ]
            }
        ]);

        assertJSON(index.toTagDescriptors(), [
            {
                "id": "nice",
                "label": "nice",
                "count": 1,
                "members": [
                    "alice"
                ]
            },
            {
                "id": "happy",
                "label": "happy",
                "count": 1,
                "members": [
                    "alice"
                ]
            },
            {
                "id": "mean",
                "label": "mean",
                "count": 1,
                "members": [
                    "bob"
                ]
            },
            {
                "id": "bad",
                "label": "bad",
                "count": 1,
                "members": [
                    "bob"
                ]
            }
        ]);

        index.delete('bob');

        assertJSON(index.toTagDescriptors(), [
                {
                    "id": "nice",
                    "label": "nice",
                    "count": 1,
                    "members": [
                        "alice"
                    ]
                },
                {
                    "id": "happy",
                    "label": "happy",
                    "count": 1,
                    "members": [
                        "alice"
                    ]
                }
            ]
        );

    });

    it("tag add and remove", function() {

        const index = new DataObjectIndex<Person>((p?: Person) => p!.tags);

        const cat = Tags.create("cat");
        const dog = Tags.create("dog");

        index.put('alice', {name: 'alice', tags: []});

        assertJSON(index.toTagDescriptors(), [
        ]);

        index.put('alice', {name: 'alice', tags: [cat]});

        assertJSON(index.toTagDescriptors(), [
            {
                "id": "cat",
                "label": "cat",
                "count": 1,
                "members": [
                    "alice"
                ]
            }
        ]);

        index.put('alice', {name: 'alice', tags: []});

        assertJSON(index.toTagDescriptors(), [
            {
                "id": "cat",
                "label": "cat",
                "count": 0,
                "members": []
            }
        ]);

    });

});


interface Person {
    readonly name: string;
    readonly tags: readonly Tag[];
}
