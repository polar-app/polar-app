import {assert} from 'chai';
import {Rect} from '../../../Rect';
import {RectText} from '../controller/RectText';
import {SelectedContents} from './SelectedContents';

const TEST_DATA  = [
    /*
     * File: Distributed Transactions
     * Page: 1 (Top right)
     * Text: finish one processing step before
     */
    {
        input: `[{"selectionRange":{"x":1159.067626953125,"y":370.1875,"width":136.6546630859375,"height":26,"top":370.1875,"right":1295.7222900390625,"bottom":396.1875,"left":1159.067626953125},"boundingClientRect":{"left":1159.0802001953125,"top":370.1875,"right":1295.7222900390625,"bottom":396.1875,"width":136.64208984375,"height":26},"text":" finish one pro-"},{"selectionRange":{"x":1159.067626953125,"y":370.1875,"width":136.6546630859375,"height":26,"top":370.1875,"right":1295.7222900390625,"bottom":396.1875,"left":1159.067626953125},"boundingClientRect":{"left":786.625,"top":396.9375,"right":960.4266357421875,"bottom":422.9375,"width":173.8016357421875,"height":26},"text":"cessing step before"}]`,
        output: 'finish one processing step before',
    },

    /*
     * File: Distributed Transactions
     * Page: 3 (Top left)
     * Text: Percolator provides cross-row, cross-table transactions with ACID snapshot-isolation semantics. Percolator users write their transaction code in an imperative language (currently C++) and mix calls to the Percolator API with their code. Figure 2 shows a simplified version of clustering documents by a hash of their contents.
     */
    {
        input: `[{"selectionRange":{"x":243.046875,"y":174.875,"width":509.47369384765625,"height":159.71875,"top":174.875,"right":752.5205688476562,"bottom":334.59375,"left":243.046875},"boundingClientRect":{"left":265.34375,"top":174.875,"right":691.8206787109375,"bottom":200.875,"width":426.4769287109375,"height":26},"text":"Percolator  provides  cross-row,  cross-table  tr"},{"selectionRange":{"x":243.046875,"y":174.875,"width":509.47369384765625,"height":159.71875,"top":174.875,"right":752.5205688476562,"bottom":334.59375,"left":243.046875},"boundingClientRect":{"left":691.8206787109375,"top":174.875,"right":752.1315307617188,"bottom":200.875,"width":60.31085205078125,"height":26},"text":"ansac-"},{"selectionRange":{"x":243.046875,"y":174.875,"width":509.47369384765625,"height":159.71875,"top":174.875,"right":752.5205688476562,"bottom":334.59375,"left":243.046875},"boundingClientRect":{"left":243.046875,"top":201.625,"right":752.1343383789062,"bottom":227.625,"width":509.08746337890625,"height":26},"text":"tions with ACID snapshot-isolation semantics. Percola-"},{"selectionRange":{"x":243.046875,"y":174.875,"width":509.47369384765625,"height":159.71875,"top":174.875,"right":752.5205688476562,"bottom":334.59375,"left":243.046875},"boundingClientRect":{"left":243.046875,"top":228.375,"right":752.5205688476562,"bottom":254.375,"width":509.47369384765625,"height":26},"text":"tor  users  write  their  transaction  code  in  an  imperative"},{"selectionRange":{"x":243.046875,"y":174.875,"width":509.47369384765625,"height":159.71875,"top":174.875,"right":752.5205688476562,"bottom":334.59375,"left":243.046875},"boundingClientRect":{"left":243.046875,"top":255.109375,"right":752.0689697265625,"bottom":281.109375,"width":509.0220947265625,"height":26},"text":"language (currently C++) and mix calls to the Percola-"},{"selectionRange":{"x":243.046875,"y":174.875,"width":509.47369384765625,"height":159.71875,"top":174.875,"right":752.5205688476562,"bottom":334.59375,"left":243.046875},"boundingClientRect":{"left":243.046875,"top":281.859375,"right":745.6642456054688,"bottom":307.859375,"width":502.61737060546875,"height":26},"text":"tor API with their code. Figure 2 shows a simplified ver"},{"selectionRange":{"x":243.046875,"y":174.875,"width":509.47369384765625,"height":159.71875,"top":174.875,"right":752.5205688476562,"bottom":334.59375,"left":243.046875},"boundingClientRect":{"left":745.6642456054688,"top":281.859375,"right":752.375732421875,"bottom":307.859375,"width":6.71148681640625,"height":26},"text":"-"},{"selectionRange":{"x":243.046875,"y":174.875,"width":509.47369384765625,"height":159.71875,"top":174.875,"right":752.5205688476562,"bottom":334.59375,"left":243.046875},"boundingClientRect":{"left":243.046875,"top":308.59375,"right":746.4492797851562,"bottom":334.59375,"width":503.40240478515625,"height":26},"text":"sion of clustering documents by a hash of their contents"},{"selectionRange":{"x":243.046875,"y":174.875,"width":509.47369384765625,"height":159.71875,"top":174.875,"right":752.5205688476562,"bottom":334.59375,"left":243.046875},"boundingClientRect":{"left":746.4492797851562,"top":308.59375,"right":752.15771484375,"bottom":334.59375,"width":5.70843505859375,"height":26},"text":"."}]`,
        output: `Percolator provides cross-row, cross-table transactions with ACID snapshot-isolation semantics. Percolator users write their transaction code in an imperative language (currently C++) and mix calls to the Percolator API with their code. Figure 2 shows a simplified version of clustering documents by a hash of their contents.`,
    },
    
    /*
     * File: availability.pdf
     * Page: 13 (Top right)
     * Text: GHEMAWAT, S., GOBIOFF, H.,ANDLEUNG
     */
    {
        input: `[{"selectionRange":{"x":825.7650756835938,"y":189.09375,"width":281.10992431640625,"height":21,"top":189.09375,"right":1106.875,"bottom":210.09375,"left":825.7650756835938},"boundingClientRect":{"left":825.7650756835938,"top":189.09375,"right":830.4266967773438,"bottom":210.09375,"width":4.66162109375,"height":21},"text":" "},{"selectionRange":{"x":825.7650756835938,"y":189.09375,"width":281.10992431640625,"height":21,"top":189.09375,"right":1106.875,"bottom":210.09375,"left":825.7650756835938},"boundingClientRect":{"left":830.4266967773438,"top":189.09375,"right":841.6347045898438,"bottom":210.09375,"width":11.2080078125,"height":21},"text":"G"},{"selectionRange":{"x":825.7650756835938,"y":189.09375,"width":281.10992431640625,"height":21,"top":189.09375,"right":1106.875,"bottom":210.09375,"left":825.7650756835938},"boundingClientRect":{"left":841.671875,"top":192.953125,"right":917.7911376953125,"bottom":208.953125,"width":76.1192626953125,"height":16},"text":"HEMAWAT"},{"selectionRange":{"x":825.7650756835938,"y":189.09375,"width":281.10992431640625,"height":21,"top":189.09375,"right":1106.875,"bottom":210.09375,"left":825.7650756835938},"boundingClientRect":{"left":916.53125,"top":189.09375,"right":965.5772094726562,"bottom":210.09375,"width":49.04595947265625,"height":21},"text":", S., G"},{"selectionRange":{"x":825.7650756835938,"y":189.09375,"width":281.10992431640625,"height":21,"top":189.09375,"right":1106.875,"bottom":210.09375,"left":825.7650756835938},"boundingClientRect":{"left":965.65625,"top":192.953125,"right":1020.6928100585938,"bottom":208.953125,"width":55.03656005859375,"height":16},"text":"OBIOFF"},{"selectionRange":{"x":825.7650756835938,"y":189.09375,"width":281.10992431640625,"height":21,"top":189.09375,"right":1106.875,"bottom":210.09375,"left":825.7650756835938},"boundingClientRect":{"left":1020.765625,"top":189.09375,"right":1054.526123046875,"bottom":210.09375,"width":33.760498046875,"height":21},"text":", H.,"},{"selectionRange":{"x":825.7650756835938,"y":189.09375,"width":281.10992431640625,"height":21,"top":189.09375,"right":1106.875,"bottom":210.09375,"left":825.7650756835938},"boundingClientRect":{"left":1059.078125,"top":192.953125,"right":1092.1571044921875,"bottom":208.953125,"width":33.0789794921875,"height":16},"text":"AND"},{"selectionRange":{"x":825.7650756835938,"y":189.09375,"width":281.10992431640625,"height":21,"top":189.09375,"right":1106.875,"bottom":210.09375,"left":825.7650756835938},"boundingClientRect":{"left":1096.8125,"top":189.09375,"right":1106.875,"bottom":210.09375,"width":10.0625,"height":21},"text":"L"},{"selectionRange":{"x":825.7650756835938,"y":189.09375,"width":281.10992431640625,"height":21,"top":189.09375,"right":1106.875,"bottom":210.09375,"left":825.7650756835938},"boundingClientRect":{"left":1108.59375,"top":192.953125,"right":1151.375,"bottom":208.953125,"width":42.78125,"height":16},"text":"EUNG"}]`,
        output: `GHEMAWAT, S., GOBIOFF, H., AND L EUNG`,
    },

    /*
     * File: bigtable.pdf
     * Page: 1 (Top left)
     * Text: Google Finance. These applications place very different demands
     */
    {
        input: `[{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":646.515625,"top":386.390625,"right":713.1141967773438,"bottom":412.390625,"width":66.59857177734375,"height":26},"text":"Google"},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":719.71875,"top":386.390625,"right":746.1483764648438,"bottom":412.390625,"width":26.42962646484375,"height":26},"text":"Fi-"},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":243.046875,"top":412.96875,"right":301.53057861328125,"bottom":438.96875,"width":58.48370361328125,"height":26},"text":"nance."},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":310.59375,"top":412.96875,"right":364.46514892578125,"bottom":438.96875,"width":53.87139892578125,"height":26},"text":"These"},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":370.375,"top":412.96875,"right":479.660888671875,"bottom":438.96875,"width":109.285888671875,"height":26},"text":"applications"},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":484.59375,"top":412.96875,"right":532.27880859375,"bottom":438.96875,"width":47.68505859375,"height":26},"text":"place"},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":537.953125,"top":412.96875,"right":578.0465087890625,"bottom":438.96875,"width":40.0933837890625,"height":26},"text":"very"},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":583.796875,"top":412.96875,"right":609.0787963867188,"bottom":438.96875,"width":25.28192138671875,"height":26},"text":"dif"},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":608.1875,"top":412.96875,"right":661.0756225585938,"bottom":438.96875,"width":52.88812255859375,"height":26},"text":"ferent"},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":666.65625,"top":412.96875,"right":746.964599609375,"bottom":438.96875,"width":80.308349609375,"height":26},"text":"demands"}]`,
        output: `Google Finance. These applications place very different demands`,
    },

    /*
     * Random Synthetic Test (Number range)
     * Text: Google 95-34556. These applications place very different demands
     */
    {
        input: `[{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":646.515625,"top":386.390625,"right":713.1141967773438,"bottom":412.390625,"width":66.59857177734375,"height":26},"text":"Google"},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":719.71875,"top":386.390625,"right":746.1483764648438,"bottom":412.390625,"width":26.42962646484375,"height":26},"text":"95-"},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":243.046875,"top":412.96875,"right":301.53057861328125,"bottom":438.96875,"width":58.48370361328125,"height":26},"text":"34556."},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":310.59375,"top":412.96875,"right":364.46514892578125,"bottom":438.96875,"width":53.87139892578125,"height":26},"text":"These"},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":370.375,"top":412.96875,"right":479.660888671875,"bottom":438.96875,"width":109.285888671875,"height":26},"text":"applications"},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":484.59375,"top":412.96875,"right":532.27880859375,"bottom":438.96875,"width":47.68505859375,"height":26},"text":"place"},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":537.953125,"top":412.96875,"right":578.0465087890625,"bottom":438.96875,"width":40.0933837890625,"height":26},"text":"very"},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":583.796875,"top":412.96875,"right":609.0787963867188,"bottom":438.96875,"width":25.28192138671875,"height":26},"text":"dif"},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":608.1875,"top":412.96875,"right":661.0756225585938,"bottom":438.96875,"width":52.88812255859375,"height":26},"text":"ferent"},{"selectionRange":{"x":243.046875,"y":386.390625,"width":503.10150146484375,"height":52.578125,"top":386.390625,"right":746.1483764648438,"bottom":438.96875,"left":243.046875},"boundingClientRect":{"left":666.65625,"top":412.96875,"right":746.964599609375,"bottom":438.96875,"width":80.308349609375,"height":26},"text":"demands"}]`,
        output: `Google 95-34556. These applications place very different demands`,
    },

    /*
     * File: bigtable.pdf
     * Page: 2 (Middle right)
     * Text: manage several different types of applications
     */
    {
        input: `[{"selectionRange":{"x":786.625,"y":215.484375,"width":503.864501953125,"height":52.84375,"top":215.484375,"right":1290.489501953125,"bottom":268.328125,"left":786.625},"boundingClientRect":{"left":1220.203125,"top":215.484375,"right":1290.489501953125,"bottom":241.484375,"width":70.286376953125,"height":26},"text":"manage"},{"selectionRange":{"x":786.625,"y":215.484375,"width":503.864501953125,"height":52.84375,"top":215.484375,"right":1290.489501953125,"bottom":268.328125,"left":786.625},"boundingClientRect":{"left":786.625,"top":242.328125,"right":827.18798828125,"bottom":268.328125,"width":40.56298828125,"height":26},"text":"seve"},{"selectionRange":{"x":786.625,"y":215.484375,"width":503.864501953125,"height":52.84375,"top":215.484375,"right":1290.489501953125,"bottom":268.328125,"left":786.625},"boundingClientRect":{"left":827.18798828125,"top":242.328125,"right":849.7964477539062,"bottom":268.328125,"width":22.60845947265625,"height":26},"text":"ral"},{"selectionRange":{"x":786.625,"y":215.484375,"width":503.864501953125,"height":52.84375,"top":215.484375,"right":1290.489501953125,"bottom":268.328125,"left":786.625},"boundingClientRect":{"left":853.125,"top":242.328125,"right":878.4069213867188,"bottom":268.328125,"width":25.28192138671875,"height":26},"text":"dif"},{"selectionRange":{"x":786.625,"y":215.484375,"width":503.864501953125,"height":52.84375,"top":215.484375,"right":1290.489501953125,"bottom":268.328125,"left":786.625},"boundingClientRect":{"left":877.515625,"top":242.328125,"right":930.4037475585938,"bottom":268.328125,"width":52.88812255859375,"height":26},"text":"ferent"},{"selectionRange":{"x":786.625,"y":215.484375,"width":503.864501953125,"height":52.84375,"top":215.484375,"right":1290.489501953125,"bottom":268.328125,"left":786.625},"boundingClientRect":{"left":933.296875,"top":242.328125,"right":980.971923828125,"bottom":268.328125,"width":47.675048828125,"height":26},"text":"types"},{"selectionRange":{"x":786.625,"y":215.484375,"width":503.864501953125,"height":52.84375,"top":215.484375,"right":1290.489501953125,"bottom":268.328125,"left":786.625},"boundingClientRect":{"left":984.765625,"top":242.328125,"right":1003.7554321289062,"bottom":268.328125,"width":18.98980712890625,"height":26},"text":"of"},{"selectionRange":{"x":786.625,"y":215.484375,"width":503.864501953125,"height":52.84375,"top":215.484375,"right":1290.489501953125,"bottom":268.328125,"left":786.625},"boundingClientRect":{"left":1007.5625,"top":242.328125,"right":1041.601806640625,"bottom":268.328125,"width":34.039306640625,"height":26},"text":"app"},{"selectionRange":{"x":786.625,"y":215.484375,"width":503.864501953125,"height":52.84375,"top":215.484375,"right":1290.489501953125,"bottom":268.328125,"left":786.625},"boundingClientRect":{"left":1041.601806640625,"top":242.328125,"right":1116.986083984375,"bottom":268.328125,"width":75.38427734375,"height":26},"text":"lications"}]`,
        output: `manage several different types of applications`,
    },

    /*
     * File: bigtable.pdf
     * Page: 2 (Middle left)
     * Text: w range is called a tablet, which is the
     */
    {
        input: `[{"selectionRange":{"x":310.4063720703125,"y":328.640625,"width":283.92156982421875,"height":26,"top":328.640625,"right":594.3279418945312,"bottom":354.640625,"left":310.4063720703125},"boundingClientRect":{"left":310.42041015625,"top":328.640625,"right":382.1744384765625,"bottom":354.640625,"width":71.7540283203125,"height":26},"text":"w range"},{"selectionRange":{"x":310.4063720703125,"y":328.640625,"width":283.92156982421875,"height":26,"top":328.640625,"right":594.3279418945312,"bottom":354.640625,"left":310.4063720703125},"boundingClientRect":{"left":385.421875,"top":328.640625,"right":459.40716552734375,"bottom":354.640625,"width":73.98529052734375,"height":26},"text":"is called"},{"selectionRange":{"x":310.4063720703125,"y":328.640625,"width":283.92156982421875,"height":26,"top":328.640625,"right":594.3279418945312,"bottom":354.640625,"left":310.4063720703125},"boundingClientRect":{"left":462.921875,"top":328.640625,"right":475.4375,"bottom":354.640625,"width":12.515625,"height":26},"text":"a"},{"selectionRange":{"x":310.4063720703125,"y":328.640625,"width":283.92156982421875,"height":26,"top":328.640625,"right":594.3279418945312,"bottom":354.640625,"left":310.4063720703125},"boundingClientRect":{"left":477.671875,"top":328.640625,"right":529.3414306640625,"bottom":354.640625,"width":51.6695556640625,"height":26},"text":"tablet"},{"selectionRange":{"x":310.4063720703125,"y":328.640625,"width":283.92156982421875,"height":26,"top":328.640625,"right":594.3279418945312,"bottom":354.640625,"left":310.4063720703125},"boundingClientRect":{"left":528.609375,"top":328.640625,"right":594.3279418945312,"bottom":354.640625,"width":65.71856689453125,"height":26},"text":", which"},{"selectionRange":{"x":310.4063720703125,"y":328.640625,"width":283.92156982421875,"height":26,"top":328.640625,"right":594.3279418945312,"bottom":354.640625,"left":310.4063720703125},"boundingClientRect":{"left":598.046875,"top":328.640625,"right":645.66845703125,"bottom":354.640625,"width":47.62158203125,"height":26},"text":"is the"}]`,
        output: `w range is called a tablet, which is the`
    },

    /*
     * File: availability.pdf
     * Page: 12 (Middle left)
     * Text: non-Markov
     *
     */
    {
        input: `[{"selectionRange":{"x":705.0496215820312,"y":139.609375,"width":48.35736083984375,"height":26,"top":139.609375,"right":753.406982421875,"bottom":165.609375,"left":705.0496215820312},"boundingClientRect":{"left":705.0643920898438,"top":139.609375,"right":753.406982421875,"bottom":165.609375,"width":48.34259033203125,"height":26},"text":" non-"},{"selectionRange":{"x":705.0496215820312,"y":139.609375,"width":48.35736083984375,"height":26,"top":139.609375,"right":753.406982421875,"bottom":165.609375,"left":705.0496215820312},"boundingClientRect":{"left":243.046875,"top":166.359375,"right":311.02484130859375,"bottom":192.359375,"width":67.97796630859375,"height":26},"text":"Markov"}]`,
        output: `non-Markov`,
    }
];

const jsonToRectTexts = (str: string): ReadonlyArray<RectText> => (
    (JSON.parse(str) as any[])
        .map(({ text, boundingClientRect, selectionRange }) => ({
            text,
            selectionRange,
            boundingClientRect: new Rect(boundingClientRect),
        }))
);

describe('SelectedContents', () => {
    describe('lineNeedsHyphenElimination', () => {
        it('Should return true for lines ends with a hyphen', () => {
            assert.equal(SelectedContents.lineNeedsHyphenElimination('elim-'), true);
        });

        it('Should return false for lines ends with a hyphen preceeded by a space', () => {
            assert.equal(SelectedContents.lineNeedsHyphenElimination('elim -'), false);
        });

        it('Should return false for lines that don\'t end with a hyphen', () => {
            assert.equal(SelectedContents.lineNeedsHyphenElimination('elim'), false);
            assert.equal(SelectedContents.lineNeedsHyphenElimination('100 '), false);
        });
    });

    describe('lineNeedsHyphenJoin', () => {
        it('Should return ture for lines that end with a range', () => {
            assert.equal(SelectedContents.lineNeedsHyphenJoin('100-'), true);
        });

        it('Should return ture for lines that end with a hyphen proceeded by "non"', () => {
            assert.equal(SelectedContents.lineNeedsHyphenJoin('Non-'), true);
            assert.equal(SelectedContents.lineNeedsHyphenJoin('non-'), true);
        });

        it('Should return false for lines that don\'t end with a hyphen', () => {
            assert.equal(SelectedContents.lineNeedsHyphenElimination('elim'), false);
            assert.equal(SelectedContents.lineNeedsHyphenElimination('100 '), false);
        });
    });

    describe('extractText', () => {
        for (let i = 0; i < TEST_DATA.length; i += 1) {
            it(`Random test case ${i + 1}`, () => {
                const { input, output } = TEST_DATA[i];
                assert.deepEqual(SelectedContents.extractText(jsonToRectTexts(input)), output);
            });
        }
    });
});
