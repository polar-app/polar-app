import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IBlock} from "../../../web/js/notes/store/IBlock";

export namespace MockBlocks {
    export function create() {

        const now = ISODateTimeStrings.create();

        const nspace = 'ns101';
        const uid = '123';
        const blocks: ReadonlyArray<IBlock> = [
            {
                id: '102',
                nspace, uid,
                parent: undefined,
                created: now,
                updated: now,
                content: "World War II",
                type: 'named',
                items: [
                    '103',
                    '104',
                    '105'
                ],
                links: []
            },
            {
                id: '103',
                nspace, uid,
                parent: '102',
                created: now,
                updated: now,
                type: 'item',
                content: '[Lasted](https://www.example.com) from 1939 to 1945',
                items: [],
                links: []
            },
            {
                id: '104',
                nspace, uid,
                parent: '102',
                created: now,
                updated: now,
                type: 'item',
                content: 'Axis Powers: Germany, Italy, Japan',
                items: [],
                links: []
            },
            {
                id: '105',
                nspace, uid,
                parent: '102',
                created: now,
                updated: now,
                content: 'Allied Powers: United States, United Kingdom, [[Canada]], [[Russia]].',
                links: ['109', '108'],
                items: [
                    '106'
                ],
                type: 'item',
            },
            {
                id: '100',
                nspace, uid,
                parent: undefined,
                created: now,
                updated: now,
                type: 'item',
                content: 'World War II (WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945. It involved the vast majority of the world\'s countries—including all the great powers—forming two opposing military alliances: the Allies and the Axis.',
                items: [],
                links: []
            },
            {
                id: '108',
                nspace, uid,
                parent: undefined,
                created: now,
                updated: now,
                content: "Russia",
                type: 'named',
                items: [],
                links: []
            },
            {
                id: '109',
                nspace, uid,
                parent: undefined,
                created: now,
                updated: now,
                content: "Canada",
                type: 'named',
                items: [
                    '111'
                ],
                links: []
            },
            {
                id: '111',
                nspace, uid,
                parent: '109',
                created: now,
                updated: now,
                type: 'item',
                content: 'Canada is north of the United States',
                items: [],
                links: []
            },
            {
                id: '106',
                nspace, uid,
                parent: '105',
                created: now,
                updated: now,
                content: 'Lead by Franklin D. Roosevelt, [[Winston Churchill]], and Joseph Stalin ',
                type: 'item',
                items: [],
                links: ['112']
            },
            {
                id: '107',
                nspace, uid,
                parent: undefined,
                created: now,
                updated: now,
                content: "Germany",
                type: 'named',
                links: [],
                items: [
                    '110'
                ]
            },
            {
                id: '110',
                nspace, uid,
                parent: '107',
                created: now,
                updated: now,
                content: 'Germany Germany (German: Deutschland, German pronunciation: [ˈdɔʏtʃlant]), officially the Federal Republic of Germany (German: Bundesrepublik Deutschland, About this soundlisten),[e] is a country in Central and Western Europe and one of the major participants of [[World War II]]',
                type: 'item',
                links: [
                    '102'
                ],
                items: []
            },
            {
                id: '112',
                nspace, uid,
                parent: undefined,
                created: now,
                updated: now,
                content: 'Winston Churchill',
                type: 'named',
                links: [
                ],
                items: []
            }

        ];
        return blocks;
    }
}
