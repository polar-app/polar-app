import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {PositionalArrays} from "polar-shared/src/util/PositionalArrays";
import {IBlock} from "polar-blocks/src/blocks/IBlock";
import {DeviceIDManager} from "polar-shared/src/util/DeviceIDManager";
import {PagemarkType} from "polar-shared/src/metadata/PagemarkType";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {Texts} from "polar-shared/src/metadata/Texts";
import {TextType} from "polar-shared/src/metadata/TextType";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {Backend} from "polar-shared/src/datastore/Backend";

export namespace MockBlocks {

    /*
     * Visual representation of the following block structure (to make it easier to debug).
     *
     *  - 102
     *      - 103
     *      - 104
     *          - 116
     *      - 105
     *          - 106
     *              - 117
     *                  - 118
     *  - 107
     *      - 110
     *  - 108
     *  - 109
     *      - 111
     *  - 112
     *
     *  - 113
     *      - 114image
     *      - 115
     *
     *  - 2020document
     *      - 2021text
     *      - 2022area
     *          - 2023flashcard
     *          - 2024
     *
     */
    export function create() {

        const now = ISODateTimeStrings.create();

        const nspace = 'ns101';
        const uid = '123';
        const blocks: ReadonlyArray<IBlock> = [
            {
                id: '102',
                nspace, uid,
                parent: undefined,
                parents: [],
                root: '102',
                created: now,
                updated: now,
                content: {
                    type: 'name',
                    data: "World War II",
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: PositionalArrays.create([
                    '103',
                    '104',
                    '105'
                ]),
                mutation: 0
            },
            {
                id: '103',
                nspace, uid,
                parent: '102',
                parents: ['102'],
                root: '102',
                created: now,
                updated: now,
                content: {
                    type: 'markdown',
                    data: '[Lasted](https://www.example.com) from 1939 to 1945',
                    links: [],
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: {},
                mutation: 0
            },
            {
                id: '104',
                nspace, uid,
                parent: '102',
                parents: ['102'],
                root: '102',
                created: now,
                updated: now,
                content: {
                    type: 'markdown',
                    data: 'Axis Powers: Germany, Italy, Japan',
                    links: [],
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: PositionalArrays.create(['116']),
                mutation: 0
            },
            {
                id: '105',
                nspace, uid,
                parent: '102',
                parents: ['102'],
                root: '102',
                created: now,
                updated: now,
                content: {
                    type: 'markdown',
                    data: 'Allied Powers: United States, United Kingdom, [[Canada]], [[Russia]].',
                    links: [
                        {
                            id: '109',
                            text: 'Canada'
                        },
                        {
                            id: '108',
                            text: 'Russia'
                        }
                    ],
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: PositionalArrays.create([
                    '106'
                ]),
                mutation: 0,
            },
            // {
            //     id: '100',
            //     nspace, uid,
            //     parent: undefined,
            //     created: now,
            //     updated: now,
            //     content: {
            //         type: 'markdown',
            //         data: 'World War II (WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945. It involved the vast majority of the world\'s countries—including all the great powers—forming two opposing military alliances: the Allies and the Axis.',
            //     },
            //     items: {},
            //     links: {},
            //     mutation: 0,
            // },
            {
                id: '108',
                nspace, uid,
                root: '108',
                parent: undefined,
                parents: [],
                created: now,
                updated: now,
                content: {
                    type: 'name',
                    data: "Russia",
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: {},
                mutation: 0,
            },
            {
                id: '109',
                nspace, uid,
                root: '109',
                parent: undefined,
                parents: [],
                created: now,
                updated: now,
                content: {
                    type: 'name',
                    data: "Canada",
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: PositionalArrays.create([
                    '111'
                ]),
                mutation: 0,
            },
            {
                id: '111',
                nspace, uid,
                root: '109',
                parent: '109',
                parents: ['109'],
                created: now,
                updated: now,
                content: {
                    type: 'markdown',
                    data: 'Canada is north of the United States',
                    links: [],
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: {},
                mutation: 0,
            },
            {
                id: '106',
                nspace, uid,
                parent: '105',
                root: '102',
                parents: ['102', '105'],
                created: now,
                updated: now,
                content: {
                    type: 'markdown',
                    data: 'Lead by Franklin D. Roosevelt, [[Winston Churchill]], and Joseph Stalin ',
                    links: [
                        {
                            id: '112',
                            text: 'Winston Churchill'
                        }
                    ],
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: PositionalArrays.create(['117']),
                mutation: 0,
            },
            {
                id: '107',
                nspace, uid,
                parent: undefined,
                parents: [],
                root: '107',
                created: now,
                updated: now,
                content: {
                    type: 'name',
                    data: "Germany",
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: PositionalArrays.create([
                    '110',
                ]),
                mutation: 0,
            },
            {
                id: '110',
                nspace, uid,
                parent: '107',
                parents: ['107'],
                root: '107',
                created: now,
                updated: now,
                content: {
                    type: 'markdown',
                    data: 'Germany Germany (German: Deutschland, German pronunciation: [ˈdɔʏtʃlant]), officially the Federal Republic of Germany (German: Bundesrepublik Deutschland, About this soundlisten),[e] is a country in Central and Western Europe and one of the major participants of [[World War II]]',
                    links: [
                        {
                            id: '102',
                            text: 'World War II'
                        }
                    ],
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: {},
                mutation: 0,
            },
            {
                id: '112',
                nspace, uid,
                parent: undefined,
                parents: [],
                root: '112',
                created: now,
                updated: now,
                content: {
                    type: 'name',
                    data: 'Winston Churchill',
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: {},
                mutation: 0,
            },
            {
                id: '116',
                nspace, uid,
                parent: '104',
                parents: ['102', '104'],
                root: '102',
                created: now,
                updated: now,
                content: {
                    type: 'markdown',
                    data: 'Some random markdown',
                    links: [],
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: {},
                mutation: 0,
            },
            {
                id: '117',
                nspace, uid,
                parent: '106',
                parents: ['102', '105', '106'],
                root: '102',
                created: now,
                updated: now,
                content: {
                    type: 'markdown',
                    data: 'Nested child with links [[Winston]]',
                    links: [{ id: '112', text: 'Winston' }],
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: PositionalArrays.create(['118']),
                mutation: 0,
            },
            {
                id: '118',
                nspace, uid,
                parent: '117',
                parents: ['102', '105', '106', '117'],
                root: '102',
                created: now,
                updated: now,
                content: {
                    type: 'markdown',
                    data: 'Deeply nested child',
                    links: [],
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: {},
                mutation: 0,
            },
            {
                id: '113',
                nspace, uid,
                parent: undefined,
                parents: [],
                root: '113',
                created: now,
                updated: now,
                content: {
                    type: 'name',
                    data: 'Image parent',
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: PositionalArrays.create([
                    '114image',
                    '115',
                ]),
                mutation: 0,
            },
            {
                id: '114image',
                nspace, uid,
                parent: '113',
                parents: ['113'],
                root: '113',
                created: now,
                updated: now,
                content: {
                    type: 'image',
                    src: 'https://google.com',
                    naturalHeight: 100,
                    naturalWidth: 100,
                    width: 100,
                    height: 100,
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: {}, 
                mutation: 0,
            },
            {
                id: '115',
                nspace, uid,
                parent: '113',
                parents: ['113'],
                root: '113',
                created: now,
                updated: now,
                content: {
                    type: 'markdown',
                    data: '',
                    links: [],
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: {}, 
                mutation: 0,
            },
            {
                id: '2020document',
                nspace, uid,
                parent: undefined,
                parents: [],
                root: '2020document',
                created: now,
                updated: now,
                content: {
                    type: 'document',
                    docInfo: {
                        flagged: false,
                        nrPages: 55,
                        archived: false,
                        progress: 55,
                        properties: {},
                        attachments: {},
                        fingerprint: '2020document',
                        pagemarkType: PagemarkType.SINGLE_COLUMN,
                        title: "Potato document",
                    },
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: PositionalArrays.create([
                    '2021text',
                    '2022area',
                ]), 
                mutation: 0,
            },
            {
                id: '2021text',
                nspace, uid,
                parent: '2020document',
                parents: ['2020document'],
                root: '2020document',
                created: now,
                updated: now,
                content: {
                    type: AnnotationContentType.TEXT_HIGHLIGHT,
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                    docID: '2020document',
                    pageNum: 15,
                    value: {
                        text: 'text highlight content',
                        rects: {},
                        color: 'yellow',
                    }
                },
                items: {}, 
                mutation: 0,
            },
            {
                id: '2022area',
                nspace, uid,
                parent: '2020document',
                parents: ['2020document'],
                root: '2020document',
                created: now,
                updated: now,
                content: {
                    type: AnnotationContentType.AREA_HIGHLIGHT,
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                    docID: '2020document',
                    pageNum: 15,
                    value: {
                        rects: {},
                        color: 'yellow',
                        image: {
                            id: 'http://google.com',
                            type: 'image/png',
                            src: { backend: Backend.IMAGE, name: 'google.png' }
                        },
                    }
                },
                items: PositionalArrays.create([
                    '2023flashcard',
                    '2024',
                ]), 
                mutation: 0,
            },
            {
                id: '2023flashcard',
                nspace, uid,
                parent: '2022area',
                parents: ['2020document', '2022area'],
                root: '2020document',
                created: now,
                updated: now,
                content: {
                    type: AnnotationContentType.FLASHCARD,
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                    docID: '2020document',
                    pageNum: 15,
                    value: {
                        type: FlashcardType.BASIC_FRONT_BACK,
                        fields: {
                            front: 'front',
                            back: 'back',
                        },
                        archetype: 'whatever',
                    }
                },
                items: {}, 
                mutation: 0,
            },
            {
                id: '2024',
                nspace, uid,
                parent: '2022area',
                parents: ['2020document', '2022area'],
                root: '2020document',
                created: now,
                updated: now,
                content: {
                    type: 'markdown',
                    data: 'Annotation markdown child',
                    links: [],
                    mutator: DeviceIDManager.TEST_DEVICE_ID,
                },
                items: {},
                mutation: 0,
            },
        ];
        return blocks;
    }
}
