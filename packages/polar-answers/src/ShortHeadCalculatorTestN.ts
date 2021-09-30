import {ShortHeadCalculator} from "./ShortHeadCalculator";
import {assertJSON} from "polar-test/src/test/Assertions";

describe("ShortHeadCalculator", () => {

    it("basic", () => {

        const opp = 2.5;
        const hyp = 5;

        const angle = ShortHeadCalculator.calcAngle(opp, hyp);
        console.log(angle)

    });


    describe("computeAngles", () => {

        it("basic", () => {

            // FIXME: normalize evertiong as min = 1.0
            //
            // - then compute the sum of all points,
            // - then divide by the vector length
            //
            // 1. the numbers will be human readable
            // 2. I think this will properly distribute space?

            const normalized = ShortHeadCalculator.normalizeXY(TEST_DATA);

            assertJSON(ShortHeadCalculator.calcAngleBetweenPoints(normalized[1], normalized[2]), {
                "angle": 79.42936592695987,
                "height": 20.85714285714289,
                "hyp": 21.217209489208425,
                "p0": {
                    "x": {
                        "original": 1,
                        "value": 3.8922448979591837
                    },
                    "y": {
                        "original": 0.013236,
                        "value": 270.12244897959187
                    }
                },
                "p1": {
                    "x": {
                        "original": 2,
                        "value": 7.784489795918367
                    },
                    "y": {
                        "original": 0.012214,
                        "value": 249.26530612244898
                    }
                },
                "width": 3.8922448979591837
            });

            assertJSON(ShortHeadCalculator.calcAngleBetweenPoints(normalized[2], normalized[3]), {
                "angle": 87.70650692649106,
                "height": 97.18367346938774,
                "hyp": 97.26158521919261,
                "p0": {
                    "x": {
                        "original": 2,
                        "value": 7.784489795918367
                    },
                    "y": {
                        "original": 0.012214,
                        "value": 249.26530612244898
                    }
                },
                "p1": {
                    "x": {
                        "original": 3,
                        "value": 11.67673469387755
                    },
                    "y": {
                        "original": 0.007452,
                        "value": 152.08163265306123
                    }
                },
                "width": 3.8922448979591833
            });

        });

    });

    describe("computeShortHead", () => {

        it("test data", () => {
            const normalized = ShortHeadCalculator.normalizeXY(TEST_DATA);
            const shortHead = ShortHeadCalculator.computeShortHead(normalized);
            assertJSON(shortHead, [
                0.019072,
                0.013236,
                0.012214,
                0.007452,
                0.007174,
                0.006611,
                0.005561,
                0.005033,
                0.004269,
                0.003433,
                0.003266,
                0.003001,
                0.00246,
                0.002366,
                0.002242,
                0.00213
            ]);

        });

    });

    describe("normalizeXY", () => {

        it("test data", () => {

            assertJSON(ShortHeadCalculator.normalizeXY(TEST_DATA), [
                {
                    "x": {
                        "value": 0,
                        "original": 0
                    },
                    "y": {
                        "value": 389.2244897959184,
                        "original": 0.019072
                    }
                },
                {
                    "x": {
                        "value": 3.8922448979591837,
                        "original": 1
                    },
                    "y": {
                        "value": 270.12244897959187,
                        "original": 0.013236
                    }
                },
                {
                    "x": {
                        "value": 7.784489795918367,
                        "original": 2
                    },
                    "y": {
                        "value": 249.26530612244898,
                        "original": 0.012214
                    }
                },
                {
                    "x": {
                        "value": 11.67673469387755,
                        "original": 3
                    },
                    "y": {
                        "value": 152.08163265306123,
                        "original": 0.007452
                    }
                },
                {
                    "x": {
                        "value": 15.568979591836735,
                        "original": 4
                    },
                    "y": {
                        "value": 146.40816326530614,
                        "original": 0.007174
                    }
                },
                {
                    "x": {
                        "value": 19.461224489795917,
                        "original": 5
                    },
                    "y": {
                        "value": 134.9183673469388,
                        "original": 0.006611
                    }
                },
                {
                    "x": {
                        "value": 23.3534693877551,
                        "original": 6
                    },
                    "y": {
                        "value": 113.48979591836735,
                        "original": 0.005561
                    }
                },
                {
                    "x": {
                        "value": 27.245714285714286,
                        "original": 7
                    },
                    "y": {
                        "value": 102.71428571428572,
                        "original": 0.005033
                    }
                },
                {
                    "x": {
                        "value": 31.13795918367347,
                        "original": 8
                    },
                    "y": {
                        "value": 87.12244897959185,
                        "original": 0.004269
                    }
                },
                {
                    "x": {
                        "value": 35.030204081632654,
                        "original": 9
                    },
                    "y": {
                        "value": 70.06122448979592,
                        "original": 0.003433
                    }
                },
                {
                    "x": {
                        "value": 38.922448979591834,
                        "original": 10
                    },
                    "y": {
                        "value": 66.6530612244898,
                        "original": 0.003266
                    }
                },
                {
                    "x": {
                        "value": 42.81469387755102,
                        "original": 11
                    },
                    "y": {
                        "value": 61.24489795918368,
                        "original": 0.003001
                    }
                },
                {
                    "x": {
                        "value": 46.7069387755102,
                        "original": 12
                    },
                    "y": {
                        "value": 50.204081632653065,
                        "original": 0.00246
                    }
                },
                {
                    "x": {
                        "value": 50.59918367346939,
                        "original": 13
                    },
                    "y": {
                        "value": 48.28571428571429,
                        "original": 0.002366
                    }
                },
                {
                    "x": {
                        "value": 54.49142857142857,
                        "original": 14
                    },
                    "y": {
                        "value": 45.75510204081633,
                        "original": 0.002242
                    }
                },
                {
                    "x": {
                        "value": 58.38367346938776,
                        "original": 15
                    },
                    "y": {
                        "value": 43.46938775510204,
                        "original": 0.00213
                    }
                },
                {
                    "x": {
                        "value": 62.27591836734694,
                        "original": 16
                    },
                    "y": {
                        "value": 36.46938775510204,
                        "original": 0.001787
                    }
                },
                {
                    "x": {
                        "value": 66.16816326530612,
                        "original": 17
                    },
                    "y": {
                        "value": 36,
                        "original": 0.001764
                    }
                },
                {
                    "x": {
                        "value": 70.06040816326531,
                        "original": 18
                    },
                    "y": {
                        "value": 35.04081632653062,
                        "original": 0.001717
                    }
                },
                {
                    "x": {
                        "value": 73.9526530612245,
                        "original": 19
                    },
                    "y": {
                        "value": 32.26530612244898,
                        "original": 0.001581
                    }
                },
                {
                    "x": {
                        "value": 77.84489795918367,
                        "original": 20
                    },
                    "y": {
                        "value": 32,
                        "original": 0.001568
                    }
                },
                {
                    "x": {
                        "value": 81.73714285714286,
                        "original": 21
                    },
                    "y": {
                        "value": 30.938775510204085,
                        "original": 0.001516
                    }
                },
                {
                    "x": {
                        "value": 85.62938775510204,
                        "original": 22
                    },
                    "y": {
                        "value": 25.591836734693878,
                        "original": 0.001254
                    }
                },
                {
                    "x": {
                        "value": 89.52163265306123,
                        "original": 23
                    },
                    "y": {
                        "value": 25.18367346938776,
                        "original": 0.001234
                    }
                },
                {
                    "x": {
                        "value": 93.4138775510204,
                        "original": 24
                    },
                    "y": {
                        "value": 24.38775510204082,
                        "original": 0.001195
                    }
                },
                {
                    "x": {
                        "value": 97.3061224489796,
                        "original": 25
                    },
                    "y": {
                        "value": 24.3265306122449,
                        "original": 0.001192
                    }
                },
                {
                    "x": {
                        "value": 101.19836734693878,
                        "original": 26
                    },
                    "y": {
                        "value": 23.755102040816332,
                        "original": 0.001164
                    }
                },
                {
                    "x": {
                        "value": 105.09061224489795,
                        "original": 27
                    },
                    "y": {
                        "value": 23.489795918367346,
                        "original": 0.001151
                    }
                },
                {
                    "x": {
                        "value": 108.98285714285714,
                        "original": 28
                    },
                    "y": {
                        "value": 23.306122448979593,
                        "original": 0.001142
                    }
                },
                {
                    "x": {
                        "value": 112.87510204081633,
                        "original": 29
                    },
                    "y": {
                        "value": 23.06122448979592,
                        "original": 0.00113
                    }
                },
                {
                    "x": {
                        "value": 116.76734693877552,
                        "original": 30
                    },
                    "y": {
                        "value": 22.489795918367346,
                        "original": 0.001102
                    }
                },
                {
                    "x": {
                        "value": 120.65959183673469,
                        "original": 31
                    },
                    "y": {
                        "value": 22.28571428571429,
                        "original": 0.001092
                    }
                },
                {
                    "x": {
                        "value": 124.55183673469388,
                        "original": 32
                    },
                    "y": {
                        "value": 20.816326530612248,
                        "original": 0.00102
                    }
                },
                {
                    "x": {
                        "value": 128.44408163265305,
                        "original": 33
                    },
                    "y": {
                        "value": 20.18367346938776,
                        "original": 0.000989
                    }
                },
                {
                    "x": {
                        "value": 132.33632653061224,
                        "original": 34
                    },
                    "y": {
                        "value": 19.551020408163268,
                        "original": 0.000958
                    }
                },
                {
                    "x": {
                        "value": 136.22857142857143,
                        "original": 35
                    },
                    "y": {
                        "value": 18.73469387755102,
                        "original": 0.000918
                    }
                },
                {
                    "x": {
                        "value": 140.12081632653062,
                        "original": 36
                    },
                    "y": {
                        "value": 17,
                        "original": 0.000833
                    }
                },
                {
                    "x": {
                        "value": 144.0130612244898,
                        "original": 37
                    },
                    "y": {
                        "value": 16.79591836734694,
                        "original": 0.000823
                    }
                },
                {
                    "x": {
                        "value": 147.905306122449,
                        "original": 38
                    },
                    "y": {
                        "value": 16,
                        "original": 0.000784
                    }
                },
                {
                    "x": {
                        "value": 151.79755102040818,
                        "original": 39
                    },
                    "y": {
                        "value": 15.85714285714286,
                        "original": 0.000777
                    }
                },
                {
                    "x": {
                        "value": 155.68979591836734,
                        "original": 40
                    },
                    "y": {
                        "value": 15.387755102040817,
                        "original": 0.000754
                    }
                },
                {
                    "x": {
                        "value": 159.58204081632653,
                        "original": 41
                    },
                    "y": {
                        "value": 15.16326530612245,
                        "original": 0.000743
                    }
                },
                {
                    "x": {
                        "value": 163.4742857142857,
                        "original": 42
                    },
                    "y": {
                        "value": 15.122448979591839,
                        "original": 0.000741
                    }
                },
                {
                    "x": {
                        "value": 167.3665306122449,
                        "original": 43
                    },
                    "y": {
                        "value": 15.040816326530614,
                        "original": 0.000737
                    }
                },
                {
                    "x": {
                        "value": 171.2587755102041,
                        "original": 44
                    },
                    "y": {
                        "value": 14.938775510204083,
                        "original": 0.000732
                    }
                },
                {
                    "x": {
                        "value": 175.15102040816328,
                        "original": 45
                    },
                    "y": {
                        "value": 14.510204081632656,
                        "original": 0.000711
                    }
                },
                {
                    "x": {
                        "value": 179.04326530612246,
                        "original": 46
                    },
                    "y": {
                        "value": 14.469387755102042,
                        "original": 0.000709
                    }
                },
                {
                    "x": {
                        "value": 182.93551020408162,
                        "original": 47
                    },
                    "y": {
                        "value": 14.142857142857144,
                        "original": 0.000693
                    }
                },
                {
                    "x": {
                        "value": 186.8277551020408,
                        "original": 48
                    },
                    "y": {
                        "value": 13.428571428571429,
                        "original": 0.000658
                    }
                },
                {
                    "x": {
                        "value": 190.72,
                        "original": 49
                    },
                    "y": {
                        "value": 13.142857142857144,
                        "original": 0.000644
                    }
                },
                {
                    "x": {
                        "value": 194.6122448979592,
                        "original": 50
                    },
                    "y": {
                        "value": 12.26530612244898,
                        "original": 0.000601
                    }
                },
                {
                    "x": {
                        "value": 198.50448979591837,
                        "original": 51
                    },
                    "y": {
                        "value": 11.89795918367347,
                        "original": 0.000583
                    }
                },
                {
                    "x": {
                        "value": 202.39673469387756,
                        "original": 52
                    },
                    "y": {
                        "value": 10.69387755102041,
                        "original": 0.000524
                    }
                },
                {
                    "x": {
                        "value": 206.28897959183675,
                        "original": 53
                    },
                    "y": {
                        "value": 10.571428571428573,
                        "original": 0.000518
                    }
                },
                {
                    "x": {
                        "value": 210.1812244897959,
                        "original": 54
                    },
                    "y": {
                        "value": 9.612244897959185,
                        "original": 0.000471
                    }
                },
                {
                    "x": {
                        "value": 214.0734693877551,
                        "original": 55
                    },
                    "y": {
                        "value": 8.775510204081634,
                        "original": 0.00043
                    }
                },
                {
                    "x": {
                        "value": 217.96571428571428,
                        "original": 56
                    },
                    "y": {
                        "value": 8.612244897959185,
                        "original": 0.000422
                    }
                },
                {
                    "x": {
                        "value": 221.85795918367347,
                        "original": 57
                    },
                    "y": {
                        "value": 8.224489795918368,
                        "original": 0.000403
                    }
                },
                {
                    "x": {
                        "value": 225.75020408163266,
                        "original": 58
                    },
                    "y": {
                        "value": 7.63265306122449,
                        "original": 0.000374
                    }
                },
                {
                    "x": {
                        "value": 229.64244897959185,
                        "original": 59
                    },
                    "y": {
                        "value": 7.510204081632653,
                        "original": 0.000368
                    }
                },
                {
                    "x": {
                        "value": 233.53469387755104,
                        "original": 60
                    },
                    "y": {
                        "value": 7.367346938775511,
                        "original": 0.000361
                    }
                },
                {
                    "x": {
                        "value": 237.4269387755102,
                        "original": 61
                    },
                    "y": {
                        "value": 6.775510204081633,
                        "original": 0.000332
                    }
                },
                {
                    "x": {
                        "value": 241.31918367346938,
                        "original": 62
                    },
                    "y": {
                        "value": 6.387755102040817,
                        "original": 0.000313
                    }
                },
                {
                    "x": {
                        "value": 245.21142857142857,
                        "original": 63
                    },
                    "y": {
                        "value": 5.857142857142858,
                        "original": 0.000287
                    }
                },
                {
                    "x": {
                        "value": 249.10367346938776,
                        "original": 64
                    },
                    "y": {
                        "value": 5.836734693877552,
                        "original": 0.000286
                    }
                },
                {
                    "x": {
                        "value": 252.99591836734695,
                        "original": 65
                    },
                    "y": {
                        "value": 5.448979591836735,
                        "original": 0.000267
                    }
                },
                {
                    "x": {
                        "value": 256.8881632653061,
                        "original": 66
                    },
                    "y": {
                        "value": 4.122448979591837,
                        "original": 0.000202
                    }
                },
                {
                    "x": {
                        "value": 260.7804081632653,
                        "original": 67
                    },
                    "y": {
                        "value": 3.877551020408164,
                        "original": 0.00019
                    }
                },
                {
                    "x": {
                        "value": 264.6726530612245,
                        "original": 68
                    },
                    "y": {
                        "value": 3.6938775510204085,
                        "original": 0.000181
                    }
                },
                {
                    "x": {
                        "value": 268.56489795918367,
                        "original": 69
                    },
                    "y": {
                        "value": 3.5306122448979598,
                        "original": 0.000173
                    }
                },
                {
                    "x": {
                        "value": 272.45714285714286,
                        "original": 70
                    },
                    "y": {
                        "value": 3.5102040816326534,
                        "original": 0.000172
                    }
                },
                {
                    "x": {
                        "value": 276.34938775510204,
                        "original": 71
                    },
                    "y": {
                        "value": 3.3061224489795924,
                        "original": 0.000162
                    }
                },
                {
                    "x": {
                        "value": 280.24163265306123,
                        "original": 72
                    },
                    "y": {
                        "value": 3.1224489795918373,
                        "original": 0.000153
                    }
                },
                {
                    "x": {
                        "value": 284.1338775510204,
                        "original": 73
                    },
                    "y": {
                        "value": 3.102040816326531,
                        "original": 0.000152
                    }
                },
                {
                    "x": {
                        "value": 288.0261224489796,
                        "original": 74
                    },
                    "y": {
                        "value": 2.938775510204082,
                        "original": 0.000144
                    }
                },
                {
                    "x": {
                        "value": 291.9183673469388,
                        "original": 75
                    },
                    "y": {
                        "value": 2.857142857142857,
                        "original": 0.00014
                    }
                },
                {
                    "x": {
                        "value": 295.810612244898,
                        "original": 76
                    },
                    "y": {
                        "value": 2.816326530612245,
                        "original": 0.000138
                    }
                },
                {
                    "x": {
                        "value": 299.70285714285717,
                        "original": 77
                    },
                    "y": {
                        "value": 2.816326530612245,
                        "original": 0.000138
                    }
                },
                {
                    "x": {
                        "value": 303.59510204081636,
                        "original": 78
                    },
                    "y": {
                        "value": 2.795918367346939,
                        "original": 0.000137
                    }
                },
                {
                    "x": {
                        "value": 307.4873469387755,
                        "original": 79
                    },
                    "y": {
                        "value": 2.3265306122448983,
                        "original": 0.000114
                    }
                },
                {
                    "x": {
                        "value": 311.3795918367347,
                        "original": 80
                    },
                    "y": {
                        "value": 2.2653061224489797,
                        "original": 0.000111
                    }
                },
                {
                    "x": {
                        "value": 315.27183673469386,
                        "original": 81
                    },
                    "y": {
                        "value": 2.1020408163265305,
                        "original": 0.000103
                    }
                },
                {
                    "x": {
                        "value": 319.16408163265305,
                        "original": 82
                    },
                    "y": {
                        "value": 2.1020408163265305,
                        "original": 0.000103
                    }
                },
                {
                    "x": {
                        "value": 323.05632653061224,
                        "original": 83
                    },
                    "y": {
                        "value": 2,
                        "original": 0.000098
                    }
                },
                {
                    "x": {
                        "value": 326.9485714285714,
                        "original": 84
                    },
                    "y": {
                        "value": 1.9183673469387756,
                        "original": 0.000094
                    }
                },
                {
                    "x": {
                        "value": 330.8408163265306,
                        "original": 85
                    },
                    "y": {
                        "value": 1.8775510204081634,
                        "original": 0.000092
                    }
                },
                {
                    "x": {
                        "value": 334.7330612244898,
                        "original": 86
                    },
                    "y": {
                        "value": 1.8571428571428574,
                        "original": 0.000091
                    }
                },
                {
                    "x": {
                        "value": 338.625306122449,
                        "original": 87
                    },
                    "y": {
                        "value": 1.816326530612245,
                        "original": 0.000089
                    }
                },
                {
                    "x": {
                        "value": 342.5175510204082,
                        "original": 88
                    },
                    "y": {
                        "value": 1.816326530612245,
                        "original": 0.000089
                    }
                },
                {
                    "x": {
                        "value": 346.40979591836737,
                        "original": 89
                    },
                    "y": {
                        "value": 1.7346938775510208,
                        "original": 0.000085
                    }
                },
                {
                    "x": {
                        "value": 350.30204081632655,
                        "original": 90
                    },
                    "y": {
                        "value": 1.63265306122449,
                        "original": 0.00008
                    }
                },
                {
                    "x": {
                        "value": 354.19428571428574,
                        "original": 91
                    },
                    "y": {
                        "value": 1.6122448979591837,
                        "original": 0.000079
                    }
                },
                {
                    "x": {
                        "value": 358.0865306122449,
                        "original": 92
                    },
                    "y": {
                        "value": 1.5918367346938778,
                        "original": 0.000078
                    }
                },
                {
                    "x": {
                        "value": 361.97877551020406,
                        "original": 93
                    },
                    "y": {
                        "value": 1.5510204081632655,
                        "original": 0.000076
                    }
                },
                {
                    "x": {
                        "value": 365.87102040816325,
                        "original": 94
                    },
                    "y": {
                        "value": 1.5102040816326532,
                        "original": 0.000074
                    }
                },
                {
                    "x": {
                        "value": 369.76326530612243,
                        "original": 95
                    },
                    "y": {
                        "value": 1.489795918367347,
                        "original": 0.000073
                    }
                },
                {
                    "x": {
                        "value": 373.6555102040816,
                        "original": 96
                    },
                    "y": {
                        "value": 1.3877551020408165,
                        "original": 0.000068
                    }
                },
                {
                    "x": {
                        "value": 377.5477551020408,
                        "original": 97
                    },
                    "y": {
                        "value": 1.3265306122448979,
                        "original": 0.000065
                    }
                },
                {
                    "x": {
                        "value": 381.44,
                        "original": 98
                    },
                    "y": {
                        "value": 1.2244897959183674,
                        "original": 0.00006
                    }
                },
                {
                    "x": {
                        "value": 385.3322448979592,
                        "original": 99
                    },
                    "y": {
                        "value": 1,
                        "original": 0.000049
                    }
                }
            ]);
        });

    });

    describe("normalizeY", () => {

        it("test data", () => {

            const normalized = ShortHeadCalculator.normalizeY(TEST_DATA);

            normalized.map(current => console.log(current.value));

            assertJSON(normalized, [
                {
                    "value": 389.2244897959184,
                    "original": 0.019072
                },
                {
                    "value": 270.12244897959187,
                    "original": 0.013236
                },
                {
                    "value": 249.26530612244898,
                    "original": 0.012214
                },
                {
                    "value": 152.08163265306123,
                    "original": 0.007452
                },
                {
                    "value": 146.40816326530614,
                    "original": 0.007174
                },
                {
                    "value": 134.9183673469388,
                    "original": 0.006611
                },
                {
                    "value": 113.48979591836735,
                    "original": 0.005561
                },
                {
                    "value": 102.71428571428572,
                    "original": 0.005033
                },
                {
                    "value": 87.12244897959185,
                    "original": 0.004269
                },
                {
                    "value": 70.06122448979592,
                    "original": 0.003433
                },
                {
                    "value": 66.6530612244898,
                    "original": 0.003266
                },
                {
                    "value": 61.24489795918368,
                    "original": 0.003001
                },
                {
                    "value": 50.204081632653065,
                    "original": 0.00246
                },
                {
                    "value": 48.28571428571429,
                    "original": 0.002366
                },
                {
                    "value": 45.75510204081633,
                    "original": 0.002242
                },
                {
                    "value": 43.46938775510204,
                    "original": 0.00213
                },
                {
                    "value": 36.46938775510204,
                    "original": 0.001787
                },
                {
                    "value": 36,
                    "original": 0.001764
                },
                {
                    "value": 35.04081632653062,
                    "original": 0.001717
                },
                {
                    "value": 32.26530612244898,
                    "original": 0.001581
                },
                {
                    "value": 32,
                    "original": 0.001568
                },
                {
                    "value": 30.938775510204085,
                    "original": 0.001516
                },
                {
                    "value": 25.591836734693878,
                    "original": 0.001254
                },
                {
                    "value": 25.18367346938776,
                    "original": 0.001234
                },
                {
                    "value": 24.38775510204082,
                    "original": 0.001195
                },
                {
                    "value": 24.3265306122449,
                    "original": 0.001192
                },
                {
                    "value": 23.755102040816332,
                    "original": 0.001164
                },
                {
                    "value": 23.489795918367346,
                    "original": 0.001151
                },
                {
                    "value": 23.306122448979593,
                    "original": 0.001142
                },
                {
                    "value": 23.06122448979592,
                    "original": 0.00113
                },
                {
                    "value": 22.489795918367346,
                    "original": 0.001102
                },
                {
                    "value": 22.28571428571429,
                    "original": 0.001092
                },
                {
                    "value": 20.816326530612248,
                    "original": 0.00102
                },
                {
                    "value": 20.18367346938776,
                    "original": 0.000989
                },
                {
                    "value": 19.551020408163268,
                    "original": 0.000958
                },
                {
                    "value": 18.73469387755102,
                    "original": 0.000918
                },
                {
                    "value": 17,
                    "original": 0.000833
                },
                {
                    "value": 16.79591836734694,
                    "original": 0.000823
                },
                {
                    "value": 16,
                    "original": 0.000784
                },
                {
                    "value": 15.85714285714286,
                    "original": 0.000777
                },
                {
                    "value": 15.387755102040817,
                    "original": 0.000754
                },
                {
                    "value": 15.16326530612245,
                    "original": 0.000743
                },
                {
                    "value": 15.122448979591839,
                    "original": 0.000741
                },
                {
                    "value": 15.040816326530614,
                    "original": 0.000737
                },
                {
                    "value": 14.938775510204083,
                    "original": 0.000732
                },
                {
                    "value": 14.510204081632656,
                    "original": 0.000711
                },
                {
                    "value": 14.469387755102042,
                    "original": 0.000709
                },
                {
                    "value": 14.142857142857144,
                    "original": 0.000693
                },
                {
                    "value": 13.428571428571429,
                    "original": 0.000658
                },
                {
                    "value": 13.142857142857144,
                    "original": 0.000644
                },
                {
                    "value": 12.26530612244898,
                    "original": 0.000601
                },
                {
                    "value": 11.89795918367347,
                    "original": 0.000583
                },
                {
                    "value": 10.69387755102041,
                    "original": 0.000524
                },
                {
                    "value": 10.571428571428573,
                    "original": 0.000518
                },
                {
                    "value": 9.612244897959185,
                    "original": 0.000471
                },
                {
                    "value": 8.775510204081634,
                    "original": 0.00043
                },
                {
                    "value": 8.612244897959185,
                    "original": 0.000422
                },
                {
                    "value": 8.224489795918368,
                    "original": 0.000403
                },
                {
                    "value": 7.63265306122449,
                    "original": 0.000374
                },
                {
                    "value": 7.510204081632653,
                    "original": 0.000368
                },
                {
                    "value": 7.367346938775511,
                    "original": 0.000361
                },
                {
                    "value": 6.775510204081633,
                    "original": 0.000332
                },
                {
                    "value": 6.387755102040817,
                    "original": 0.000313
                },
                {
                    "value": 5.857142857142858,
                    "original": 0.000287
                },
                {
                    "value": 5.836734693877552,
                    "original": 0.000286
                },
                {
                    "value": 5.448979591836735,
                    "original": 0.000267
                },
                {
                    "value": 4.122448979591837,
                    "original": 0.000202
                },
                {
                    "value": 3.877551020408164,
                    "original": 0.00019
                },
                {
                    "value": 3.6938775510204085,
                    "original": 0.000181
                },
                {
                    "value": 3.5306122448979598,
                    "original": 0.000173
                },
                {
                    "value": 3.5102040816326534,
                    "original": 0.000172
                },
                {
                    "value": 3.3061224489795924,
                    "original": 0.000162
                },
                {
                    "value": 3.1224489795918373,
                    "original": 0.000153
                },
                {
                    "value": 3.102040816326531,
                    "original": 0.000152
                },
                {
                    "value": 2.938775510204082,
                    "original": 0.000144
                },
                {
                    "value": 2.857142857142857,
                    "original": 0.00014
                },
                {
                    "value": 2.816326530612245,
                    "original": 0.000138
                },
                {
                    "value": 2.816326530612245,
                    "original": 0.000138
                },
                {
                    "value": 2.795918367346939,
                    "original": 0.000137
                },
                {
                    "value": 2.3265306122448983,
                    "original": 0.000114
                },
                {
                    "value": 2.2653061224489797,
                    "original": 0.000111
                },
                {
                    "value": 2.1020408163265305,
                    "original": 0.000103
                },
                {
                    "value": 2.1020408163265305,
                    "original": 0.000103
                },
                {
                    "value": 2,
                    "original": 0.000098
                },
                {
                    "value": 1.9183673469387756,
                    "original": 0.000094
                },
                {
                    "value": 1.8775510204081634,
                    "original": 0.000092
                },
                {
                    "value": 1.8571428571428574,
                    "original": 0.000091
                },
                {
                    "value": 1.816326530612245,
                    "original": 0.000089
                },
                {
                    "value": 1.816326530612245,
                    "original": 0.000089
                },
                {
                    "value": 1.7346938775510208,
                    "original": 0.000085
                },
                {
                    "value": 1.63265306122449,
                    "original": 0.00008
                },
                {
                    "value": 1.6122448979591837,
                    "original": 0.000079
                },
                {
                    "value": 1.5918367346938778,
                    "original": 0.000078
                },
                {
                    "value": 1.5510204081632655,
                    "original": 0.000076
                },
                {
                    "value": 1.5102040816326532,
                    "original": 0.000074
                },
                {
                    "value": 1.489795918367347,
                    "original": 0.000073
                },
                {
                    "value": 1.3877551020408165,
                    "original": 0.000068
                },
                {
                    "value": 1.3265306122448979,
                    "original": 0.000065
                },
                {
                    "value": 1.2244897959183674,
                    "original": 0.00006
                },
                {
                    "value": 1,
                    "original": 0.000049
                }
            ]);

        });
    });

})


// common crawl pagerank data:
// https://commoncrawl.org/2020/02/host-and-domain-level-web-graphs-novdecjan-2019-2020/

const TEST_DATA = [
    0.019072,
    0.013236,
    0.012214,
    0.007452,
    0.007174,
    0.006611,
    0.005561,
    0.005033,
    0.004269,
    0.003433,
    0.003266,
    0.003001,
    0.00246,
    0.002366,
    0.002242,
    0.00213,
    0.001787,
    0.001764,
    0.001717,
    0.001581,
    0.001568,
    0.001516,
    0.001254,
    0.001234,
    0.001195,
    0.001192,
    0.001164,
    0.001151,
    0.001142,
    0.00113,
    0.001102,
    0.001092,
    0.00102,
    0.000989,
    0.000958,
    0.000918,
    0.000833,
    0.000823,
    0.000784,
    0.000777,
    0.000754,
    0.000743,
    0.000741,
    0.000737,
    0.000732,
    0.000711,
    0.000709,
    0.000693,
    0.000658,
    0.000644,
    0.000601,
    0.000583,
    0.000524,
    0.000518,
    0.000471,
    0.00043,
    0.000422,
    0.000403,
    0.000374,
    0.000368,
    0.000361,
    0.000332,
    0.000313,
    0.000287,
    0.000286,
    0.000267,
    0.000202,
    0.00019,
    0.000181,
    0.000173,
    0.000172,
    0.000162,
    0.000153,
    0.000152,
    0.000144,
    0.00014,
    0.000138,
    0.000138,
    0.000137,
    0.000114,
    0.000111,
    0.000103,
    0.000103,
    0.000098,
    0.000094,
    0.000092,
    0.000091,
    0.000089,
    0.000089,
    0.000085,
    0.00008,
    0.000079,
    0.000078,
    0.000076,
    0.000074,
    0.000073,
    0.000068,
    0.000065,
    0.00006,
    0.000049,
]
