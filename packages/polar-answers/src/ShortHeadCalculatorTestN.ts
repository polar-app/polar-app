import {ShortHeadCalculator} from "./ShortHeadCalculator";
import {assertJSON} from "polar-test/src/test/Assertions";
import {assert} from 'chai';

describe("ShortHeadCalculator", () => {

    it("angle computation", () => {

        const opp = 2.5;
        const hyp = 5;

        const angle = ShortHeadCalculator.calcAngle(opp, hyp);
        assert.equal(Math.floor(angle), 30)

    });


    describe("computeAngles", () => {

        xit("basic", () => {

            // FIXME: normalize evertiong as min = 1.0
            //
            // - then compute the sum of all points,
            // - then divide by the vector length
            //
            // 1. the numbers will be human readable
            // 2. I think this will properly distribute space?

            const normalized = ShortHeadCalculator.normalizeXY(TEST_DATA_FROM_PAGERANK);

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

    describe("compute", () => {

        xit("test data from pagerank", () => {
            const head = ShortHeadCalculator.compute(TEST_DATA_FROM_PAGERANK);
            assertJSON(head, [
                226.001,
                194.994,
                192.001,
                188.298,
                183.254,
                182.309,
                181.963,
                177.795,
                176.084,
                175.549,
                172.785,
                171.826,
                169.671,
                169.031,
                168.953,
                168.157,
                167.831,
                167.201,
                167.187,
                166.549,
                165.077,
                164.92,
                163.798,
                163.048,
                162.726,
                162.65,
                162.475,
                161.215,
                160.397,
                160.331,
                160.295,
                159.953,
                159.839,
                159.711,
                159.06,
                158.2,
                157.404,
                157.094,
                156.667,
                156.647,
                155.762,
                154.5,
                154.158,
                152.035,
                150.323,
                150.014,
                149.716,
                149.657,
                149.496,
                149.435,
                148.581,
                148.352,
                148.004,
                147.997,
                147.266,
                147.067,
                146.957
            ]);
        });

        it("test data from elasticsearch1", () => {
            const head = ShortHeadCalculator.compute(TEST_DATA_FROM_ELASTICSEARCH1, {
                target_angle: 30,
                min_docs: 50,
                max_docs: 50,
            });

            assert.equal(TEST_DATA_FROM_ELASTICSEARCH1.length, 1277);
            assert.equal(head!.length, 144);

        });


        it("test data from openai", () => {
            const head = ShortHeadCalculator.compute(TEST_DATA_FROM_OPENAI_SEARCH, {
                target_angle: 45,
                min_docs: 50,
                max_docs: 50,
            });
            assertJSON(head, [
                226.001,
                194.994,
                192.001,
                188.298,
                183.254,
                182.309,
                181.963,
                177.795,
                176.084,
                175.549,
                172.785,
                171.826,
                169.671,
                169.031,
                168.953,
                168.157,
                167.831,
                167.201,
                167.187,
                166.549,
                165.077,
                164.92,
                163.798,
                163.048,
                162.726,
                162.65,
                162.475,
                161.215,
                160.397,
                160.331,
                160.295,
                159.953,
                159.839,
                159.711,
                159.06,
                158.2,
                157.404,
                157.094,
                156.667,
                156.647,
                155.762,
                154.5,
                154.158,
                152.035,
                150.323,
                150.014,
                149.716,
                149.657,
                149.496,
                149.435,
                148.581,
                148.352,
                148.004,
                147.997,
                147.266,
                147.067,
                146.957
            ]);
        });

        it("test data from openai without negative values", () => {
            const head = ShortHeadCalculator.compute(TEST_DATA_FROM_OPENAI_SEARCH.filter(current => current > 0.0), {
                target_angle: 45,
                min_docs: 50,
                max_docs: 50,
            });
            assertJSON(head, [
                226.001,
                194.994,
                192.001,
                188.298,
                183.254,
                182.309,
                181.963,
                177.795,
                176.084,
                175.549,
                172.785,
                171.826,
                169.671,
                169.031,
                168.953,
                168.157,
                167.831,
                167.201,
                167.187,
                166.549,
                165.077,
                164.92,
                163.798,
                163.048,
                162.726,
                162.65,
                162.475,
                161.215,
                160.397,
                160.331,
                160.295,
                159.953,
                159.839,
                159.711,
                159.06,
                158.2,
                157.404,
                157.094,
                156.667,
                156.647,
                155.762,
                154.5,
                154.158,
                152.035
            ]);
        });

    });



    describe("computeShortHead", () => {

        xit("test data", () => {
            const normalized = ShortHeadCalculator.normalizeXY(TEST_DATA_FROM_PAGERANK);
            const shortHead = ShortHeadCalculator.computeShortHead(normalized, 45, 50);
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

        xit("test data from pagerank", () => {

            assertJSON(ShortHeadCalculator.normalizeXY(TEST_DATA_FROM_PAGERANK), [
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

        xit("test data from pagerank", () => {

            const normalized = ShortHeadCalculator.normalizeY(TEST_DATA_FROM_PAGERANK);

            normalized.map(current => console.log(current.value));

            // assertJSON(normalized, [
            //     {
            //         "value": 389.2244897959184,
            //         "original": 0.019072
            //     },
            //     {
            //         "value": 270.12244897959187,
            //         "original": 0.013236
            //     },
            //     {
            //         "value": 249.26530612244898,
            //         "original": 0.012214
            //     },
            //     {
            //         "value": 152.08163265306123,
            //         "original": 0.007452
            //     },
            //     {
            //         "value": 146.40816326530614,
            //         "original": 0.007174
            //     },
            //     {
            //         "value": 134.9183673469388,
            //         "original": 0.006611
            //     },
            //     {
            //         "value": 113.48979591836735,
            //         "original": 0.005561
            //     },
            //     {
            //         "value": 102.71428571428572,
            //         "original": 0.005033
            //     },
            //     {
            //         "value": 87.12244897959185,
            //         "original": 0.004269
            //     },
            //     {
            //         "value": 70.06122448979592,
            //         "original": 0.003433
            //     },
            //     {
            //         "value": 66.6530612244898,
            //         "original": 0.003266
            //     },
            //     {
            //         "value": 61.24489795918368,
            //         "original": 0.003001
            //     },
            //     {
            //         "value": 50.204081632653065,
            //         "original": 0.00246
            //     },
            //     {
            //         "value": 48.28571428571429,
            //         "original": 0.002366
            //     },
            //     {
            //         "value": 45.75510204081633,
            //         "original": 0.002242
            //     },
            //     {
            //         "value": 43.46938775510204,
            //         "original": 0.00213
            //     },
            //     {
            //         "value": 36.46938775510204,
            //         "original": 0.001787
            //     },
            //     {
            //         "value": 36,
            //         "original": 0.001764
            //     },
            //     {
            //         "value": 35.04081632653062,
            //         "original": 0.001717
            //     },
            //     {
            //         "value": 32.26530612244898,
            //         "original": 0.001581
            //     },
            //     {
            //         "value": 32,
            //         "original": 0.001568
            //     },
            //     {
            //         "value": 30.938775510204085,
            //         "original": 0.001516
            //     },
            //     {
            //         "value": 25.591836734693878,
            //         "original": 0.001254
            //     },
            //     {
            //         "value": 25.18367346938776,
            //         "original": 0.001234
            //     },
            //     {
            //         "value": 24.38775510204082,
            //         "original": 0.001195
            //     },
            //     {
            //         "value": 24.3265306122449,
            //         "original": 0.001192
            //     },
            //     {
            //         "value": 23.755102040816332,
            //         "original": 0.001164
            //     },
            //     {
            //         "value": 23.489795918367346,
            //         "original": 0.001151
            //     },
            //     {
            //         "value": 23.306122448979593,
            //         "original": 0.001142
            //     },
            //     {
            //         "value": 23.06122448979592,
            //         "original": 0.00113
            //     },
            //     {
            //         "value": 22.489795918367346,
            //         "original": 0.001102
            //     },
            //     {
            //         "value": 22.28571428571429,
            //         "original": 0.001092
            //     },
            //     {
            //         "value": 20.816326530612248,
            //         "original": 0.00102
            //     },
            //     {
            //         "value": 20.18367346938776,
            //         "original": 0.000989
            //     },
            //     {
            //         "value": 19.551020408163268,
            //         "original": 0.000958
            //     },
            //     {
            //         "value": 18.73469387755102,
            //         "original": 0.000918
            //     },
            //     {
            //         "value": 17,
            //         "original": 0.000833
            //     },
            //     {
            //         "value": 16.79591836734694,
            //         "original": 0.000823
            //     },
            //     {
            //         "value": 16,
            //         "original": 0.000784
            //     },
            //     {
            //         "value": 15.85714285714286,
            //         "original": 0.000777
            //     },
            //     {
            //         "value": 15.387755102040817,
            //         "original": 0.000754
            //     },
            //     {
            //         "value": 15.16326530612245,
            //         "original": 0.000743
            //     },
            //     {
            //         "value": 15.122448979591839,
            //         "original": 0.000741
            //     },
            //     {
            //         "value": 15.040816326530614,
            //         "original": 0.000737
            //     },
            //     {
            //         "value": 14.938775510204083,
            //         "original": 0.000732
            //     },
            //     {
            //         "value": 14.510204081632656,
            //         "original": 0.000711
            //     },
            //     {
            //         "value": 14.469387755102042,
            //         "original": 0.000709
            //     },
            //     {
            //         "value": 14.142857142857144,
            //         "original": 0.000693
            //     },
            //     {
            //         "value": 13.428571428571429,
            //         "original": 0.000658
            //     },
            //     {
            //         "value": 13.142857142857144,
            //         "original": 0.000644
            //     },
            //     {
            //         "value": 12.26530612244898,
            //         "original": 0.000601
            //     },
            //     {
            //         "value": 11.89795918367347,
            //         "original": 0.000583
            //     },
            //     {
            //         "value": 10.69387755102041,
            //         "original": 0.000524
            //     },
            //     {
            //         "value": 10.571428571428573,
            //         "original": 0.000518
            //     },
            //     {
            //         "value": 9.612244897959185,
            //         "original": 0.000471
            //     },
            //     {
            //         "value": 8.775510204081634,
            //         "original": 0.00043
            //     },
            //     {
            //         "value": 8.612244897959185,
            //         "original": 0.000422
            //     },
            //     {
            //         "value": 8.224489795918368,
            //         "original": 0.000403
            //     },
            //     {
            //         "value": 7.63265306122449,
            //         "original": 0.000374
            //     },
            //     {
            //         "value": 7.510204081632653,
            //         "original": 0.000368
            //     },
            //     {
            //         "value": 7.367346938775511,
            //         "original": 0.000361
            //     },
            //     {
            //         "value": 6.775510204081633,
            //         "original": 0.000332
            //     },
            //     {
            //         "value": 6.387755102040817,
            //         "original": 0.000313
            //     },
            //     {
            //         "value": 5.857142857142858,
            //         "original": 0.000287
            //     },
            //     {
            //         "value": 5.836734693877552,
            //         "original": 0.000286
            //     },
            //     {
            //         "value": 5.448979591836735,
            //         "original": 0.000267
            //     },
            //     {
            //         "value": 4.122448979591837,
            //         "original": 0.000202
            //     },
            //     {
            //         "value": 3.877551020408164,
            //         "original": 0.00019
            //     },
            //     {
            //         "value": 3.6938775510204085,
            //         "original": 0.000181
            //     },
            //     {
            //         "value": 3.5306122448979598,
            //         "original": 0.000173
            //     },
            //     {
            //         "value": 3.5102040816326534,
            //         "original": 0.000172
            //     },
            //     {
            //         "value": 3.3061224489795924,
            //         "original": 0.000162
            //     },
            //     {
            //         "value": 3.1224489795918373,
            //         "original": 0.000153
            //     },
            //     {
            //         "value": 3.102040816326531,
            //         "original": 0.000152
            //     },
            //     {
            //         "value": 2.938775510204082,
            //         "original": 0.000144
            //     },
            //     {
            //         "value": 2.857142857142857,
            //         "original": 0.00014
            //     },
            //     {
            //         "value": 2.816326530612245,
            //         "original": 0.000138
            //     },
            //     {
            //         "value": 2.816326530612245,
            //         "original": 0.000138
            //     },
            //     {
            //         "value": 2.795918367346939,
            //         "original": 0.000137
            //     },
            //     {
            //         "value": 2.3265306122448983,
            //         "original": 0.000114
            //     },
            //     {
            //         "value": 2.2653061224489797,
            //         "original": 0.000111
            //     },
            //     {
            //         "value": 2.1020408163265305,
            //         "original": 0.000103
            //     },
            //     {
            //         "value": 2.1020408163265305,
            //         "original": 0.000103
            //     },
            //     {
            //         "value": 2,
            //         "original": 0.000098
            //     },
            //     {
            //         "value": 1.9183673469387756,
            //         "original": 0.000094
            //     },
            //     {
            //         "value": 1.8775510204081634,
            //         "original": 0.000092
            //     },
            //     {
            //         "value": 1.8571428571428574,
            //         "original": 0.000091
            //     },
            //     {
            //         "value": 1.816326530612245,
            //         "original": 0.000089
            //     },
            //     {
            //         "value": 1.816326530612245,
            //         "original": 0.000089
            //     },
            //     {
            //         "value": 1.7346938775510208,
            //         "original": 0.000085
            //     },
            //     {
            //         "value": 1.63265306122449,
            //         "original": 0.00008
            //     },
            //     {
            //         "value": 1.6122448979591837,
            //         "original": 0.000079
            //     },
            //     {
            //         "value": 1.5918367346938778,
            //         "original": 0.000078
            //     },
            //     {
            //         "value": 1.5510204081632655,
            //         "original": 0.000076
            //     },
            //     {
            //         "value": 1.5102040816326532,
            //         "original": 0.000074
            //     },
            //     {
            //         "value": 1.489795918367347,
            //         "original": 0.000073
            //     },
            //     {
            //         "value": 1.3877551020408165,
            //         "original": 0.000068
            //     },
            //     {
            //         "value": 1.3265306122448979,
            //         "original": 0.000065
            //     },
            //     {
            //         "value": 1.2244897959183674,
            //         "original": 0.00006
            //     },
            //     {
            //         "value": 1,
            //         "original": 0.000049
            //     }
            // ]);

        });

        it("test data from openai", () => {

            const normalized = ShortHeadCalculator.normalizeY(TEST_DATA_FROM_OPENAI_SEARCH);

            normalized.map(current => console.log(current));

            assertJSON(normalized, [
                {
                    "value": -0.6274764550106525,
                    "original": 226.001
                },
                {
                    "value": -0.4731298409095434,
                    "original": 194.994
                },
                {
                    "value": -0.4582312884534974,
                    "original": 192.001
                },
                {
                    "value": -0.43979849869581666,
                    "original": 188.298
                },
                {
                    "value": -0.414690480457161,
                    "original": 183.254
                },
                {
                    "value": -0.4099864603866754,
                    "original": 182.309
                },
                {
                    "value": -0.4082641419270055,
                    "original": 181.963
                },
                {
                    "value": -0.38751667562670483,
                    "original": 177.795
                },
                {
                    "value": -0.3789996615096669,
                    "original": 176.084
                },
                {
                    "value": -0.3763365390358999,
                    "original": 175.549
                },
                {
                    "value": -0.3625779025546064,
                    "original": 172.785
                },
                {
                    "value": -0.35780419329789137,
                    "original": 171.826
                },
                {
                    "value": -0.3470770364175776,
                    "original": 169.671
                },
                {
                    "value": -0.34389124504709,
                    "original": 169.031
                },
                {
                    "value": -0.3435029767238118,
                    "original": 168.953
                },
                {
                    "value": -0.33954064870676787,
                    "original": 168.157
                },
                {
                    "value": -0.33791788622742563,
                    "original": 167.831
                },
                {
                    "value": -0.33478187284710187,
                    "original": 167.201
                },
                {
                    "value": -0.3347121836608726,
                    "original": 167.187
                },
                {
                    "value": -0.3315363478884177,
                    "original": 166.549
                },
                {
                    "value": -0.3242090277362961,
                    "original": 165.077
                },
                {
                    "value": -0.32342751329072333,
                    "original": 164.92
                },
                {
                    "value": -0.3178424227943373,
                    "original": 163.798
                },
                {
                    "value": -0.3141090735320471,
                    "original": 163.048
                },
                {
                    "value": -0.3125062222487705,
                    "original": 162.726
                },
                {
                    "value": -0.3121279095235251,
                    "original": 162.65
                },
                {
                    "value": -0.3112567946956573,
                    "original": 162.475
                },
                {
                    "value": -0.3049847679350099,
                    "original": 161.215
                },
                {
                    "value": -0.3009129283396053,
                    "original": 160.397
                },
                {
                    "value": -0.30058439360452377,
                    "original": 160.331
                },
                {
                    "value": -0.30040519283993383,
                    "original": 160.295
                },
                {
                    "value": -0.29870278557632957,
                    "original": 159.953
                },
                {
                    "value": -0.2981353164884615,
                    "original": 159.839
                },
                {
                    "value": -0.297498158214364,
                    "original": 159.711
                },
                {
                    "value": -0.29425761105469606,
                    "original": 159.06
                },
                {
                    "value": -0.28997670390060326,
                    "original": 158.2
                },
                {
                    "value": -0.2860143758835593,
                    "original": 157.404
                },
                {
                    "value": -0.28447125818847935,
                    "original": 157.094
                },
                {
                    "value": -0.28234573800848217,
                    "original": 156.667
                },
                {
                    "value": -0.2822461820281544,
                    "original": 156.647
                },
                {
                    "value": -0.277840829898652,
                    "original": 155.762
                },
                {
                    "value": -0.2715588475399717,
                    "original": 154.5
                },
                {
                    "value": -0.26985644027636735,
                    "original": 154.158
                },
                {
                    "value": -0.25928857296457797,
                    "original": 152.035
                },
                {
                    "value": -0.2507665810485236,
                    "original": 150.323
                },
                {
                    "value": -0.24922844115246007,
                    "original": 150.014
                },
                {
                    "value": -0.24774505704557676,
                    "original": 149.716
                },
                {
                    "value": -0.24745136690360994,
                    "original": 149.657
                },
                {
                    "value": -0.24664994126197165,
                    "original": 149.496
                },
                {
                    "value": -0.24634629552197201,
                    "original": 149.435
                },
                {
                    "value": -0.24209525516197752,
                    "original": 148.581
                },
                {
                    "value": -0.240955339187225,
                    "original": 148.352
                },
                {
                    "value": -0.2392230651295223,
                    "original": 148.004
                },
                {
                    "value": -0.2391882205364077,
                    "original": 147.997
                },
                {
                    "value": -0.23554944945542874,
                    "original": 147.266
                },
                {
                    "value": -0.23455886745116783,
                    "original": 147.067
                },
                {
                    "value": -0.2340113095593652,
                    "original": 146.957
                },
                {
                    "value": -0.22841128566592991,
                    "original": 145.832
                },
                {
                    "value": -0.228386396670848,
                    "original": 145.827
                },
                {
                    "value": -0.22782888318101271,
                    "original": 145.715
                },
                {
                    "value": -0.2263255878780639,
                    "original": 145.413
                },
                {
                    "value": -0.2255590068295402,
                    "original": 145.259
                },
                {
                    "value": -0.22439420185970574,
                    "original": 145.025
                },
                {
                    "value": -0.22388148856101783,
                    "original": 144.922
                },
                {
                    "value": -0.22387153296298504,
                    "original": 144.92
                },
                {
                    "value": -0.22383171057085402,
                    "original": 144.912
                },
                {
                    "value": -0.22293072894888794,
                    "original": 144.731
                },
                {
                    "value": -0.22068574159249746,
                    "original": 144.28
                },
                {
                    "value": -0.2199390717400394,
                    "original": 144.13
                },
                {
                    "value": -0.2195259144216793,
                    "original": 144.047
                },
                {
                    "value": -0.21727097146725602,
                    "original": 143.594
                },
                {
                    "value": -0.2152350516695538,
                    "original": 143.185
                },
                {
                    "value": -0.21459291559643995,
                    "original": 143.056
                },
                {
                    "value": -0.21163112518168972,
                    "original": 142.461
                },
                {
                    "value": -0.2093114708400534,
                    "original": 141.995
                },
                {
                    "value": -0.2086842681639886,
                    "original": 141.869
                },
                {
                    "value": -0.20593652310694308,
                    "original": 141.317
                },
                {
                    "value": -0.20510523067120645,
                    "original": 141.15
                },
                {
                    "value": -0.2049409633036656,
                    "original": 141.117
                },
                {
                    "value": -0.20347251259383153,
                    "original": 140.822
                },
                {
                    "value": -0.2027805985305537,
                    "original": 140.683
                },
                {
                    "value": -0.2026412201580949,
                    "original": 140.655
                },
                {
                    "value": -0.2017253051390797,
                    "original": 140.471
                },
                {
                    "value": -0.2014266371980965,
                    "original": 140.411
                },
                {
                    "value": -0.19746928698006896,
                    "original": 139.616
                },
                {
                    "value": -0.19736475320072477,
                    "original": 139.595
                },
                {
                    "value": -0.19683212870597136,
                    "original": 139.488
                },
                {
                    "value": -0.19640901578957845,
                    "original": 139.403
                },
                {
                    "value": -0.19453736335941693,
                    "original": 139.027
                },
                {
                    "value": -0.19269059992433749,
                    "original": 138.656
                },
                {
                    "value": -0.19266073313023915,
                    "original": 138.65
                },
                {
                    "value": -0.19212313083646937,
                    "original": 138.542
                },
                {
                    "value": -0.1897785874997511,
                    "original": 138.071
                },
                {
                    "value": -0.1891016068335225,
                    "original": 137.935
                },
                {
                    "value": -0.18878800549549019,
                    "original": 137.872
                },
                {
                    "value": -0.18825538100073666,
                    "original": 137.765
                },
                {
                    "value": -0.1870855982318858,
                    "original": 137.53
                },
                {
                    "value": -0.18430798638074194,
                    "original": 136.972
                },
                {
                    "value": -0.18394460705254564,
                    "original": 136.899
                },
                {
                    "value": -0.1821177548135317,
                    "original": 136.532
                },
                {
                    "value": -0.18193855404894177,
                    "original": 136.496
                },
                {
                    "value": -0.18093303864763163,
                    "original": 136.294
                },
                {
                    "value": -0.18084841606435292,
                    "original": 136.277
                },
                {
                    "value": -0.18071899328992697,
                    "original": 136.251
                },
                {
                    "value": -0.17918085339386342,
                    "original": 135.942
                },
                {
                    "value": -0.17628377436632625,
                    "original": 135.36
                },
                {
                    "value": -0.17626884096927703,
                    "original": 135.357
                },
                {
                    "value": -0.1751936363817374,
                    "original": 135.141
                },
                {
                    "value": -0.17311291639288778,
                    "original": 134.723
                },
                {
                    "value": -0.17299842701551077,
                    "original": 134.7
                },
                {
                    "value": -0.17294367122633053,
                    "original": 134.689
                },
                {
                    "value": -0.17220197917288887,
                    "original": 134.54
                },
                {
                    "value": -0.17110686338928377,
                    "original": 134.32
                },
                {
                    "value": -0.1696583238755152,
                    "original": 134.029
                },
                {
                    "value": -0.16833920713617273,
                    "original": 133.764
                },
                {
                    "value": -0.16744320331322304,
                    "original": 133.584
                },
                {
                    "value": -0.1673834697250264,
                    "original": 133.572
                },
                {
                    "value": -0.165681062461422,
                    "original": 133.23
                },
                {
                    "value": -0.16465563586404636,
                    "original": 133.024
                },
                {
                    "value": -0.16397865519781776,
                    "original": 132.888
                },
                {
                    "value": -0.16164406745913232,
                    "original": 132.419
                },
                {
                    "value": -0.16143002210142765,
                    "original": 132.376
                },
                {
                    "value": -0.16089241980765787,
                    "original": 132.268
                },
                {
                    "value": -0.1598620154112658,
                    "original": 132.061
                },
                {
                    "value": -0.15925472393126652,
                    "original": 131.939
                },
                {
                    "value": -0.15553133026700916,
                    "original": 131.191
                },
                {
                    "value": -0.15489914979192798,
                    "original": 131.064
                },
                {
                    "value": -0.1546701710371742,
                    "original": 131.018
                },
                {
                    "value": -0.15413754654242082,
                    "original": 130.911
                },
                {
                    "value": -0.15354021066045437,
                    "original": 130.791
                },
                {
                    "value": -0.15190251478406303,
                    "original": 130.462
                },
                {
                    "value": -0.1515839356470143,
                    "original": 130.398
                },
                {
                    "value": -0.1495679270453776,
                    "original": 129.993
                },
                {
                    "value": -0.1490601915457061,
                    "original": 129.891
                },
                {
                    "value": -0.14892579097226372,
                    "original": 129.864
                },
                {
                    "value": -0.1486271230312805,
                    "original": 129.804
                },
                {
                    "value": -0.14812934312964185,
                    "original": 129.704
                },
                {
                    "value": -0.14779085279652748,
                    "original": 129.636
                },
                {
                    "value": -0.14772614140931442,
                    "original": 129.623
                },
                {
                    "value": -0.14690480457161062,
                    "original": 129.458
                },
                {
                    "value": -0.14570017720964504,
                    "original": 129.216
                },
                {
                    "value": -0.14469963960735116,
                    "original": 129.015
                },
                {
                    "value": -0.14397288095095873,
                    "original": 128.869
                },
                {
                    "value": -0.14375385779423766,
                    "original": 128.825
                },
                {
                    "value": -0.14330087808374653,
                    "original": 128.734
                },
                {
                    "value": -0.14307189932899264,
                    "original": 128.688
                },
                {
                    "value": -0.1419518945503056,
                    "original": 128.463
                },
                {
                    "value": -0.14170798239850263,
                    "original": 128.414
                },
                {
                    "value": -0.1404784660414551,
                    "original": 128.167
                },
                {
                    "value": -0.13955757322342352,
                    "original": 127.982
                },
                {
                    "value": -0.13951775083129245,
                    "original": 127.974
                },
                {
                    "value": -0.13936343906178444,
                    "original": 127.943
                },
                {
                    "value": -0.1387760587778508,
                    "original": 127.825
                },
                {
                    "value": -0.13837783485653987,
                    "original": 127.745
                },
                {
                    "value": -0.13677996137227966,
                    "original": 127.424
                },
                {
                    "value": -0.13665053859785356,
                    "original": 127.398
                },
                {
                    "value": -0.13538617764769134,
                    "original": 127.144
                },
                {
                    "value": -0.13455986301097106,
                    "original": 126.978
                },
                {
                    "value": -0.13445532923162692,
                    "original": 126.957
                },
                {
                    "value": -0.13369372598211976,
                    "original": 126.804
                },
                {
                    "value": -0.13317603488441554,
                    "original": 126.7
                },
                {
                    "value": -0.1330466121099895,
                    "original": 126.674
                },
                {
                    "value": -0.13227007546343308,
                    "original": 126.518
                },
                {
                    "value": -0.1318867849391713,
                    "original": 126.441
                },
                {
                    "value": -0.13160802819425366,
                    "original": 126.385
                },
                {
                    "value": -0.1314636720227784,
                    "original": 126.356
                },
                {
                    "value": -0.13126456006212295,
                    "original": 126.316
                },
                {
                    "value": -0.13106544810146745,
                    "original": 126.276
                },
                {
                    "value": -0.13043824542540275,
                    "original": 126.15
                },
                {
                    "value": -0.1287258825637656,
                    "original": 125.806
                },
                {
                    "value": -0.1285068594070446,
                    "original": 125.762
                },
                {
                    "value": -0.12777014515261934,
                    "original": 125.614
                },
                {
                    "value": -0.12772036716245544,
                    "original": 125.604
                },
                {
                    "value": -0.1258387591342612,
                    "original": 125.226
                },
                {
                    "value": -0.1251070226788523,
                    "original": 125.079
                },
                {
                    "value": -0.12502737789459015,
                    "original": 125.063
                },
                {
                    "value": -0.12405172928737832,
                    "original": 124.867
                },
                {
                    "value": -0.1227624793421341,
                    "original": 124.608
                },
                {
                    "value": -0.12251856719033112,
                    "original": 124.559
                },
                {
                    "value": -0.12211536547000376,
                    "original": 124.478
                },
                {
                    "value": -0.12134380662246379,
                    "original": 124.323
                },
                {
                    "value": -0.12130896202934913,
                    "original": 124.316
                },
                {
                    "value": -0.1201590904565637,
                    "original": 124.085
                },
                {
                    "value": -0.12015411265754736,
                    "original": 124.084
                },
                {
                    "value": -0.11959659916771198,
                    "original": 123.972
                },
                {
                    "value": -0.11957668797164649,
                    "original": 123.968
                },
                {
                    "value": -0.11916353065328637,
                    "original": 123.885
                },
                {
                    "value": -0.1181281484578779,
                    "original": 123.677
                },
                {
                    "value": -0.1167891205224698,
                    "original": 123.408
                },
                {
                    "value": -0.11644067459132268,
                    "original": 123.338
                },
                {
                    "value": -0.11431017661230909,
                    "original": 122.91
                },
                {
                    "value": -0.1141707982398503,
                    "original": 122.882
                },
                {
                    "value": -0.11262270274575394,
                    "original": 122.571
                },
                {
                    "value": -0.11232901260378712,
                    "original": 122.512
                },
                {
                    "value": -0.11201541126575473,
                    "original": 122.449
                },
                {
                    "value": -0.11175158791788624,
                    "original": 122.396
                },
                {
                    "value": -0.109098421042152,
                    "original": 121.863
                },
                {
                    "value": -0.10879975310116878,
                    "original": 121.803
                },
                {
                    "value": -0.10861059673854609,
                    "original": 121.765
                },
                {
                    "value": -0.10828703980248096,
                    "original": 121.7
                },
                {
                    "value": -0.10799334966051415,
                    "original": 121.641
                },
                {
                    "value": -0.10739601377854768,
                    "original": 121.521
                },
                {
                    "value": -0.10729645779821997,
                    "original": 121.501
                },
                {
                    "value": -0.10709236803854805,
                    "original": 121.46
                },
                {
                    "value": -0.10669912191625351,
                    "original": 121.381
                },
                {
                    "value": -0.10657965473986022,
                    "original": 121.357
                },
                {
                    "value": -0.1064751209605161,
                    "original": 121.336
                },
                {
                    "value": -0.10570853991199253,
                    "original": 121.182
                },
                {
                    "value": -0.10548951675527152,
                    "original": 121.138
                },
                {
                    "value": -0.10436951197658442,
                    "original": 120.913
                },
                {
                    "value": -0.1038070206877327,
                    "original": 120.8
                },
                {
                    "value": -0.10276168289429148,
                    "original": 120.59
                },
                {
                    "value": -0.10199510184576792,
                    "original": 120.436
                },
                {
                    "value": -0.10193039045855486,
                    "original": 120.423
                },
                {
                    "value": -0.10079047448380227,
                    "original": 120.194
                },
                {
                    "value": -0.0995111801365908,
                    "original": 119.937
                },
                {
                    "value": -0.09913784521036177,
                    "original": 119.862
                },
                {
                    "value": -0.09911793401429626,
                    "original": 119.858
                },
                {
                    "value": -0.09874957688708365,
                    "original": 119.784
                },
                {
                    "value": -0.098689843298887,
                    "original": 119.772
                },
                {
                    "value": -0.09785855086315037,
                    "original": 119.605
                },
                {
                    "value": -0.09692272464806963,
                    "original": 119.417
                },
                {
                    "value": -0.095409473747088,
                    "original": 119.113
                },
                {
                    "value": -0.09512076140413758,
                    "original": 119.055
                },
                {
                    "value": -0.09505107221790812,
                    "original": 119.041
                },
                {
                    "value": -0.09429942456643371,
                    "original": 118.89
                },
                {
                    "value": -0.09401071222348324,
                    "original": 118.832
                },
                {
                    "value": -0.09379168906676223,
                    "original": 118.788
                },
                {
                    "value": -0.09326404237102524,
                    "original": 118.682
                },
                {
                    "value": -0.09234314955299365,
                    "original": 118.497
                },
                {
                    "value": -0.09212412639627264,
                    "original": 118.453
                },
                {
                    "value": -0.092064392808076,
                    "original": 118.441
                },
                {
                    "value": -0.09161141309758475,
                    "original": 118.35
                },
                {
                    "value": -0.09110367759791334,
                    "original": 118.248
                },
                {
                    "value": -0.09063576449037293,
                    "original": 118.154
                },
                {
                    "value": -0.09006331760348846,
                    "original": 118.039
                },
                {
                    "value": -0.08974473846643966,
                    "original": 117.975
                },
                {
                    "value": -0.08755948469824584,
                    "original": 117.536
                },
                {
                    "value": -0.08640961312546049,
                    "original": 117.305
                },
                {
                    "value": -0.08463253887661029,
                    "original": 116.948
                },
                {
                    "value": -0.08106843478087729,
                    "original": 116.232
                },
                {
                    "value": -0.08078967803595964,
                    "original": 116.176
                },
                {
                    "value": -0.08052585468809115,
                    "original": 116.123
                },
                {
                    "value": -0.08004300818350157,
                    "original": 116.026
                },
                {
                    "value": -0.07999323019333775,
                    "original": 116.016
                },
                {
                    "value": -0.07897278139497844,
                    "original": 115.811
                },
                {
                    "value": -0.078813491826454,
                    "original": 115.779
                },
                {
                    "value": -0.07729028532743962,
                    "original": 115.473
                },
                {
                    "value": -0.0763395257153097,
                    "original": 115.282
                },
                {
                    "value": -0.07624992533301474,
                    "original": 115.264
                },
                {
                    "value": -0.07589650160285127,
                    "original": 115.193
                },
                {
                    "value": -0.07512992055432771,
                    "original": 115.039
                },
                {
                    "value": -0.07373115903072296,
                    "original": 114.758
                },
                {
                    "value": -0.07294466678613382,
                    "original": 114.6
                },
                {
                    "value": -0.07222288592875774,
                    "original": 114.455
                },
                {
                    "value": -0.07216315234056109,
                    "original": 114.443
                },
                {
                    "value": -0.07169026143400434,
                    "original": 114.348
                },
                {
                    "value": -0.07092865818449712,
                    "original": 114.195
                },
                {
                    "value": -0.07003265436154751,
                    "original": 114.015
                },
                {
                    "value": -0.06948011867072854,
                    "original": 113.904
                },
                {
                    "value": -0.06921629532286004,
                    "original": 113.851
                },
                {
                    "value": -0.06911673934253233,
                    "original": 113.831
                },
                {
                    "value": -0.06866375963204108,
                    "original": 113.74
                },
                {
                    "value": -0.06783246719630445,
                    "original": 113.573
                },
                {
                    "value": -0.0669961969615515,
                    "original": 113.405
                },
                {
                    "value": -0.06387511697827693,
                    "original": 112.778
                },
                {
                    "value": -0.0634569818609004,
                    "original": 112.694
                },
                {
                    "value": -0.06344702626286758,
                    "original": 112.692
                },
                {
                    "value": -0.06312844712581886,
                    "original": 112.628
                },
                {
                    "value": -0.061764530195328834,
                    "original": 112.354
                },
                {
                    "value": -0.061764530195328834,
                    "original": 112.354
                },
                {
                    "value": -0.0612468390976246,
                    "original": 112.25
                },
                {
                    "value": -0.06033590187762576,
                    "original": 112.067
                },
                {
                    "value": -0.05984309977500351,
                    "original": 111.968
                },
                {
                    "value": -0.05835473786910379,
                    "original": 111.669
                },
                {
                    "value": -0.05752344543336717,
                    "original": 111.502
                },
                {
                    "value": -0.05652290783107343,
                    "original": 111.301
                },
                {
                    "value": -0.05598032773828721,
                    "original": 111.192
                },
                {
                    "value": -0.05583099376779567,
                    "original": 111.162
                },
                {
                    "value": -0.055691615395336805,
                    "original": 111.134
                },
                {
                    "value": -0.055676681998287646,
                    "original": 111.131
                },
                {
                    "value": -0.055293391474025864,
                    "original": 111.054
                },
                {
                    "value": -0.05504450152320653,
                    "original": 111.004
                },
                {
                    "value": -0.05412858650419128,
                    "original": 110.82
                },
                {
                    "value": -0.05331720526452023,
                    "original": 110.657
                },
                {
                    "value": -0.05325747167632359,
                    "original": 110.645
                },
                {
                    "value": -0.05276964737271767,
                    "original": 110.547
                },
                {
                    "value": -0.05116181829042473,
                    "original": 110.224
                },
                {
                    "value": -0.05008661370288512,
                    "original": 110.008
                },
                {
                    "value": -0.0495042112179679,
                    "original": 109.891
                },
                {
                    "value": -0.049130876291738866,
                    "original": 109.816
                },
                {
                    "value": -0.04885211954682121,
                    "original": 109.76
                },
                {
                    "value": -0.04796607132190428,
                    "original": 109.582
                },
                {
                    "value": -0.04758775859665891,
                    "original": 109.506
                },
                {
                    "value": -0.047030245106823604,
                    "original": 109.394
                },
                {
                    "value": -0.046607132190430674,
                    "original": 109.309
                },
                {
                    "value": -0.04652250960715212,
                    "original": 109.292
                },
                {
                    "value": -0.046263664058299965,
                    "original": 109.24
                },
                {
                    "value": -0.04597992951436597,
                    "original": 109.183
                },
                {
                    "value": -0.04289369412420606,
                    "original": 108.563
                },
                {
                    "value": -0.04284889393305858,
                    "original": 108.554
                },
                {
                    "value": -0.042724448957648875,
                    "original": 108.529
                },
                {
                    "value": -0.041778667144535375,
                    "original": 108.339
                },
                {
                    "value": -0.04138542102224084,
                    "original": 108.26
                },
                {
                    "value": -0.04131075403699503,
                    "original": 108.245
                },
                {
                    "value": -0.040424705812078104,
                    "original": 108.067
                },
                {
                    "value": -0.040265416243553745,
                    "original": 108.035
                },
                {
                    "value": -0.038692431754375464,
                    "original": 107.719
                },
                {
                    "value": -0.03829918563208093,
                    "original": 107.64
                },
                {
                    "value": -0.038239452043884285,
                    "original": 107.628
                },
                {
                    "value": -0.03795073970093381,
                    "original": 107.57
                },
                {
                    "value": -0.03670131214782074,
                    "original": 107.319
                },
                {
                    "value": -0.036596778368476614,
                    "original": 107.298
                },
                {
                    "value": -0.03587997531011687,
                    "original": 107.154
                },
                {
                    "value": -0.03582024172192022,
                    "original": 107.142
                },
                {
                    "value": -0.035685841148477775,
                    "original": 107.115
                },
                {
                    "value": -0.0353075284232324,
                    "original": 107.039
                },
                {
                    "value": -0.03475001493339709,
                    "original": 106.927
                },
                {
                    "value": -0.0344563247914302,
                    "original": 106.868
                },
                {
                    "value": -0.03410290106126675,
                    "original": 106.797
                },
                {
                    "value": -0.03285347350815367,
                    "original": 106.546
                },
                {
                    "value": -0.03279871771897337,
                    "original": 106.535
                },
                {
                    "value": -0.03279871771897337,
                    "original": 106.535
                },
                {
                    "value": -0.03219640403799058,
                    "original": 106.414
                },
                {
                    "value": -0.032091870258646446,
                    "original": 106.393
                },
                {
                    "value": -0.032037114469466214,
                    "original": 106.382
                },
                {
                    "value": -0.03188280269995819,
                    "original": 106.351
                },
                {
                    "value": -0.02955817055930551,
                    "original": 105.884
                },
                {
                    "value": -0.029115146446847078,
                    "original": 105.795
                },
                {
                    "value": -0.029040479461601272,
                    "original": 105.78
                },
                {
                    "value": -0.028756744917667207,
                    "original": 105.723
                },
                {
                    "value": -0.02844812137865123,
                    "original": 105.661
                },
                {
                    "value": -0.028094697648487772,
                    "original": 105.59
                },
                {
                    "value": -0.0275421619576688,
                    "original": 105.479
                },
                {
                    "value": -0.027442605977341085,
                    "original": 105.459
                },
                {
                    "value": -0.027114071242259535,
                    "original": 105.393
                },
                {
                    "value": -0.025436552973737127,
                    "original": 105.056
                },
                {
                    "value": -0.024854150488819837,
                    "original": 104.939
                },
                {
                    "value": -0.024326503793082852,
                    "original": 104.833
                },
                {
                    "value": -0.023988013459968552,
                    "original": 104.765
                },
                {
                    "value": -0.022763474901937395,
                    "original": 104.519
                },
                {
                    "value": -0.02237022877964279,
                    "original": 104.44
                },
                {
                    "value": -0.021464269358660363,
                    "original": 104.258
                },
                {
                    "value": -0.02134977998128348,
                    "original": 104.235
                },
                {
                    "value": -0.020453776158333874,
                    "original": 104.055
                },
                {
                    "value": -0.020224797403580044,
                    "original": 104.009
                },
                {
                    "value": -0.019189415208171575,
                    "original": 103.801
                },
                {
                    "value": -0.019089859227843856,
                    "original": 103.781
                },
                {
                    "value": -0.01901519224259805,
                    "original": 103.766
                },
                {
                    "value": -0.018960436453417745,
                    "original": 103.755
                },
                {
                    "value": -0.01697927244489577,
                    "original": 103.357
                },
                {
                    "value": -0.016431714553093214,
                    "original": 103.247
                },
                {
                    "value": -0.015495888338012461,
                    "original": 103.059
                },
                {
                    "value": -0.01456006212293171,
                    "original": 102.871
                },
                {
                    "value": -0.014291260976046806,
                    "original": 102.817
                },
                {
                    "value": -0.013982637437030829,
                    "original": 102.755
                },
                {
                    "value": -0.013693925094080425,
                    "original": 102.697
                },
                {
                    "value": -0.013440057344244683,
                    "original": 102.646
                },
                {
                    "value": -0.013440057344244683,
                    "original": 102.646
                },
                {
                    "value": -0.01340521275112995,
                    "original": 102.639
                },
                {
                    "value": -0.01236983055572148,
                    "original": 102.431
                },
                {
                    "value": -0.012290185771459333,
                    "original": 102.415
                },
                {
                    "value": -0.012081118212771073,
                    "original": 102.373
                },
                {
                    "value": -0.012076140413754663,
                    "original": 102.372
                },
                {
                    "value": -0.01168289429146013,
                    "original": 102.293
                },
                {
                    "value": -0.010294088365888127,
                    "original": 102.014
                },
                {
                    "value": -0.010269199370806215,
                    "original": 102.009
                },
                {
                    "value": -0.00962208549867594,
                    "original": 101.879
                },
                {
                    "value": -0.009308484160643553,
                    "original": 101.816
                },
                {
                    "value": -0.008920215837365358,
                    "original": 101.738
                },
                {
                    "value": -0.00835772454851364,
                    "original": 101.625
                },
                {
                    "value": -0.007854966847858566,
                    "original": 101.524
                },
                {
                    "value": -0.007830077852776653,
                    "original": 101.519
                },
                {
                    "value": -0.007486609720645943,
                    "original": 101.45
                },
                {
                    "value": -0.006869362642613919,
                    "original": 101.326
                },
                {
                    "value": -0.0062371821675328044,
                    "original": 101.199
                },
                {
                    "value": -0.006062959201959279,
                    "original": 101.164
                },
                {
                    "value": -0.005888736236385754,
                    "original": 101.129
                },
                {
                    "value": -0.00584891384425461,
                    "original": 101.121
                },
                {
                    "value": -0.005714513270812158,
                    "original": 101.094
                },
                {
                    "value": -0.005371045138681519,
                    "original": 101.025
                },
                {
                    "value": -0.005097266192780205,
                    "original": 100.97
                },
                {
                    "value": -0.004430241124584356,
                    "original": 100.836
                },
                {
                    "value": -0.0034794815124544434,
                    "original": 100.645
                },
                {
                    "value": -0.002359476733767416,
                    "original": 100.42
                },
                {
                    "value": -0.002165342572128319,
                    "original": 100.381
                },
                {
                    "value": -0.0011299603767198488,
                    "original": 100.173
                },
                {
                    "value": -0.0002289787547538303,
                    "original": 99.992
                },
                {
                    "value": 0.00038329052426178334,
                    "original": 99.869
                },
                {
                    "value": 0.0017820520478665357,
                    "original": 99.588
                },
                {
                    "value": 0.0028721900324552405,
                    "original": 99.369
                },
                {
                    "value": 0.00321068036556954,
                    "original": 99.301
                },
                {
                    "value": 0.0041962845708141865,
                    "original": 99.103
                },
                {
                    "value": 0.004201262369830526,
                    "original": 99.102
                },
                {
                    "value": 0.004519841506879324,
                    "original": 99.038
                },
                {
                    "value": 0.004913087629173858,
                    "original": 98.959
                },
                {
                    "value": 0.0055602015013042055,
                    "original": 98.829
                },
                {
                    "value": 0.006501005515401297,
                    "original": 98.64
                },
                {
                    "value": 0.00653087230949962,
                    "original": 98.634
                },
                {
                    "value": 0.006799673456384523,
                    "original": 98.58
                },
                {
                    "value": 0.007123230392449661,
                    "original": 98.515
                },
                {
                    "value": 0.010284132767855378,
                    "original": 97.88
                },
                {
                    "value": 0.0111353363996575,
                    "original": 97.709
                },
                {
                    "value": 0.012449475339983695,
                    "original": 97.445
                },
                {
                    "value": 0.013071700217032061,
                    "original": 97.32
                },
                {
                    "value": 0.013863170260637539,
                    "original": 97.161
                },
                {
                    "value": 0.014256416382932144,
                    "original": 97.082
                },
                {
                    "value": 0.014953308245226315,
                    "original": 96.942
                },
                {
                    "value": 0.015022997431455711,
                    "original": 96.928
                },
                {
                    "value": 0.015306731975389775,
                    "original": 96.871
                },
                {
                    "value": 0.01560042211735659,
                    "original": 96.812
                },
                {
                    "value": 0.015839356470143173,
                    "original": 96.764
                },
                {
                    "value": 0.01592397905342173,
                    "original": 96.747
                },
                {
                    "value": 0.016202735798339384,
                    "original": 96.691
                },
                {
                    "value": 0.01628735838161794,
                    "original": 96.674
                },
                {
                    "value": 0.016655715508830632,
                    "original": 96.6
                },
                {
                    "value": 0.016775182685223922,
                    "original": 96.576
                },
                {
                    "value": 0.01755171933178024,
                    "original": 96.42
                },
                {
                    "value": 0.01892061406128667,
                    "original": 96.145
                },
                {
                    "value": 0.019308882384564865,
                    "original": 96.067
                },
                {
                    "value": 0.019438305158990907,
                    "original": 96.041
                },
                {
                    "value": 0.020443820560301054,
                    "original": 95.839
                },
                {
                    "value": 0.020692710511120385,
                    "original": 95.789
                },
                {
                    "value": 0.021076001035382166,
                    "original": 95.712
                },
                {
                    "value": 0.021205423809808208,
                    "original": 95.686
                },
                {
                    "value": 0.021494136152758685,
                    "original": 95.628
                },
                {
                    "value": 0.021738048304561677,
                    "original": 95.579
                },
                {
                    "value": 0.02187742667702047,
                    "original": 95.551
                },
                {
                    "value": 0.022484718157019672,
                    "original": 95.429
                },
                {
                    "value": 0.022644007725544035,
                    "original": 95.397
                },
                {
                    "value": 0.022668896720626018,
                    "original": 95.392
                },
                {
                    "value": 0.02312685423013361,
                    "original": 95.3
                },
                {
                    "value": 0.02351014475439539,
                    "original": 95.223
                },
                {
                    "value": 0.023544989347510124,
                    "original": 95.216
                },
                {
                    "value": 0.024117436234394593,
                    "original": 95.101
                },
                {
                    "value": 0.024595304939967755,
                    "original": 95.005
                },
                {
                    "value": 0.024689883121279062,
                    "original": 94.986
                },
                {
                    "value": 0.025028373454393363,
                    "original": 94.918
                },
                {
                    "value": 0.025332019194393,
                    "original": 94.857
                },
                {
                    "value": 0.025864643689146396,
                    "original": 94.75
                },
                {
                    "value": 0.025994066463572437,
                    "original": 94.724
                },
                {
                    "value": 0.026033888855703582,
                    "original": 94.716
                },
                {
                    "value": 0.02624295641439177,
                    "original": 94.674
                },
                {
                    "value": 0.026442068375047277,
                    "original": 94.634
                },
                {
                    "value": 0.026561535551440568,
                    "original": 94.61
                },
                {
                    "value": 0.026661091531768284,
                    "original": 94.59
                },
                {
                    "value": 0.026666069330784695,
                    "original": 94.589
                },
                {
                    "value": 0.026780558708161574,
                    "original": 94.566
                },
                {
                    "value": 0.028169364633733505,
                    "original": 94.287
                },
                {
                    "value": 0.02819923142783183,
                    "original": 94.281
                },
                {
                    "value": 0.028935945682257144,
                    "original": 94.133
                },
                {
                    "value": 0.029324214005535268,
                    "original": 94.055
                },
                {
                    "value": 0.02938394759373191,
                    "original": 94.043
                },
                {
                    "value": 0.02971248232881346,
                    "original": 93.977
                },
                {
                    "value": 0.029787149314059267,
                    "original": 93.962
                },
                {
                    "value": 0.03074288672520559,
                    "original": 93.77
                },
                {
                    "value": 0.030747864524221933,
                    "original": 93.769
                },
                {
                    "value": 0.0314248451904506,
                    "original": 93.633
                },
                {
                    "value": 0.032126714851761114,
                    "original": 93.492
                },
                {
                    "value": 0.032435338390777085,
                    "original": 93.43
                },
                {
                    "value": 0.033112319057005755,
                    "original": 93.294
                },
                {
                    "value": 0.03419747924257812,
                    "original": 93.076
                },
                {
                    "value": 0.03439161340421715,
                    "original": 93.037
                },
                {
                    "value": 0.0344513469924138,
                    "original": 93.025
                },
                {
                    "value": 0.03454094737470876,
                    "original": 93.007
                },
                {
                    "value": 0.03577544153077274,
                    "original": 92.759
                },
                {
                    "value": 0.03577544153077274,
                    "original": 92.759
                },
                {
                    "value": 0.03589490870716603,
                    "original": 92.735
                },
                {
                    "value": 0.03668140095175517,
                    "original": 92.577
                },
                {
                    "value": 0.03735340381896743,
                    "original": 92.442
                },
                {
                    "value": 0.03746789319634431,
                    "original": 92.419
                },
                {
                    "value": 0.03855803118093301,
                    "original": 92.2
                },
                {
                    "value": 0.03885172132289983,
                    "original": 92.141
                },
                {
                    "value": 0.038856699121916236,
                    "original": 92.14
                },
                {
                    "value": 0.03900105529339144,
                    "original": 92.111
                },
                {
                    "value": 0.039259900842243595,
                    "original": 92.059
                },
                {
                    "value": 0.039807458734046154,
                    "original": 91.949
                },
                {
                    "value": 0.040210660454373506,
                    "original": 91.868
                },
                {
                    "value": 0.04084284092945462,
                    "original": 91.741
                },
                {
                    "value": 0.041435199012404667,
                    "original": 91.622
                },
                {
                    "value": 0.041649244370109334,
                    "original": 91.579
                },
                {
                    "value": 0.04220178006092823,
                    "original": 91.468
                },
                {
                    "value": 0.04253031479600978,
                    "original": 91.402
                },
                {
                    "value": 0.042963383310435456,
                    "original": 91.315
                },
                {
                    "value": 0.04540748262748143,
                    "original": 90.824
                },
                {
                    "value": 0.04567130597534992,
                    "original": 90.771
                },
                {
                    "value": 0.04611433008780835,
                    "original": 90.682
                },
                {
                    "value": 0.04622384166616889,
                    "original": 90.66
                },
                {
                    "value": 0.04712980108715132,
                    "original": 90.478
                },
                {
                    "value": 0.04721442367042988,
                    "original": 90.461
                },
                {
                    "value": 0.0481154052923959,
                    "original": 90.28
                },
                {
                    "value": 0.05009656930091787,
                    "original": 89.882
                },
                {
                    "value": 0.05190848814288273,
                    "original": 89.518
                },
                {
                    "value": 0.05345658363697909,
                    "original": 89.207
                },
                {
                    "value": 0.05358600641140513,
                    "original": 89.181
                },
                {
                    "value": 0.053959341337634165,
                    "original": 89.106
                },
                {
                    "value": 0.0549598789399279,
                    "original": 88.905
                },
                {
                    "value": 0.055343169464189684,
                    "original": 88.828
                },
                {
                    "value": 0.05655775242418809,
                    "original": 88.584
                },
                {
                    "value": 0.05701570993369568,
                    "original": 88.492
                },
                {
                    "value": 0.05872807279533282,
                    "original": 88.148
                },
                {
                    "value": 0.059464787049758064,
                    "original": 88
                },
                {
                    "value": 0.06062959201959258,
                    "original": 87.766
                },
                {
                    "value": 0.061435995460247285,
                    "original": 87.604
                },
                {
                    "value": 0.06159030722975531,
                    "original": 87.573
                },
                {
                    "value": 0.062187643111721695,
                    "original": 87.453
                },
                {
                    "value": 0.06252115564581966,
                    "original": 87.386
                },
                {
                    "value": 0.06397965075762098,
                    "original": 87.093
                },
                {
                    "value": 0.06472632061007905,
                    "original": 86.943
                },
                {
                    "value": 0.06546303486450429,
                    "original": 86.795
                },
                {
                    "value": 0.06556756864384841,
                    "original": 86.774
                },
                {
                    "value": 0.06562232443302865,
                    "original": 86.763
                },
                {
                    "value": 0.06594588136909386,
                    "original": 86.698
                },
                {
                    "value": 0.0664635724667981,
                    "original": 86.594
                },
                {
                    "value": 0.06722517571630525,
                    "original": 86.441
                },
                {
                    "value": 0.0674342432749935,
                    "original": 86.399
                },
                {
                    "value": 0.06753877705433764,
                    "original": 86.378
                },
                {
                    "value": 0.06770802222089482,
                    "original": 86.344
                },
                {
                    "value": 0.06827051350974654,
                    "original": 86.231
                },
                {
                    "value": 0.06838500288712343,
                    "original": 86.208
                },
                {
                    "value": 0.06839495848515617,
                    "original": 86.206
                },
                {
                    "value": 0.06901718336220454,
                    "original": 86.081
                },
                {
                    "value": 0.06920633972482723,
                    "original": 86.043
                },
                {
                    "value": 0.07045576727794037,
                    "original": 85.792
                },
                {
                    "value": 0.07087888019433329,
                    "original": 85.707
                },
                {
                    "value": 0.07217310793859384,
                    "original": 85.447
                },
                {
                    "value": 0.0722378193258069,
                    "original": 85.434
                },
                {
                    "value": 0.07239213109531485,
                    "original": 85.403
                },
                {
                    "value": 0.07244190908547875,
                    "original": 85.393
                },
                {
                    "value": 0.07248173147760982,
                    "original": 85.385
                },
                {
                    "value": 0.07275053262449473,
                    "original": 85.331
                },
                {
                    "value": 0.07442307309400072,
                    "original": 84.995
                },
                {
                    "value": 0.07483623041236083,
                    "original": 84.912
                },
                {
                    "value": 0.07545347749039286,
                    "original": 84.788
                },
                {
                    "value": 0.0756326782549828,
                    "original": 84.752
                },
                {
                    "value": 0.07569738964219577,
                    "original": 84.739
                },
                {
                    "value": 0.07629970332317863,
                    "original": 84.618
                },
                {
                    "value": 0.07653365987694881,
                    "original": 84.571
                },
                {
                    "value": 0.07655854887203072,
                    "original": 84.566
                },
                {
                    "value": 0.07736495231268543,
                    "original": 84.404
                },
                {
                    "value": 0.07821117814547121,
                    "original": 84.234
                },
                {
                    "value": 0.0782808673317006,
                    "original": 84.22
                },
                {
                    "value": 0.07838042331202832,
                    "original": 84.2
                },
                {
                    "value": 0.0790076259880931,
                    "original": 84.074
                },
                {
                    "value": 0.07918682675268304,
                    "original": 84.038
                },
                {
                    "value": 0.0792017601497322,
                    "original": 84.035
                },
                {
                    "value": 0.07948549469366627,
                    "original": 83.978
                },
                {
                    "value": 0.08181012683431894,
                    "original": 83.511
                },
                {
                    "value": 0.08183003803038445,
                    "original": 83.507
                },
                {
                    "value": 0.08193457180972857,
                    "original": 83.486
                },
                {
                    "value": 0.082377595922187,
                    "original": 83.397
                },
                {
                    "value": 0.08243732951038366,
                    "original": 83.385
                },
                {
                    "value": 0.08254684108874419,
                    "original": 83.363
                },
                {
                    "value": 0.08500587380283932,
                    "original": 82.869
                },
                {
                    "value": 0.08518009676841284,
                    "original": 82.834
                },
                {
                    "value": 0.08586703303267428,
                    "original": 82.696
                },
                {
                    "value": 0.08602134480218222,
                    "original": 82.665
                },
                {
                    "value": 0.08696214881627938,
                    "original": 82.476
                },
                {
                    "value": 0.08751468450709836,
                    "original": 82.365
                },
                {
                    "value": 0.08767397407562272,
                    "original": 82.333
                },
                {
                    "value": 0.08827130995758917,
                    "original": 82.213
                },
                {
                    "value": 0.08904784660414548,
                    "original": 82.057
                },
                {
                    "value": 0.08905780220217824,
                    "original": 82.055
                },
                {
                    "value": 0.08955060430480057,
                    "original": 81.956
                },
                {
                    "value": 0.08998367281922624,
                    "original": 81.869
                },
                {
                    "value": 0.09024749616709474,
                    "original": 81.816
                },
                {
                    "value": 0.09071540927463514,
                    "original": 81.722
                },
                {
                    "value": 0.0914770125241423,
                    "original": 81.569
                },
                {
                    "value": 0.09176572486709278,
                    "original": 81.511
                },
                {
                    "value": 0.09185532524938775,
                    "original": 81.493
                },
                {
                    "value": 0.0921340819943054,
                    "original": 81.437
                },
                {
                    "value": 0.09223861577364953,
                    "original": 81.416
                },
                {
                    "value": 0.09229337156282975,
                    "original": 81.405
                },
                {
                    "value": 0.09304501921430416,
                    "original": 81.254
                },
                {
                    "value": 0.09309479720446806,
                    "original": 81.244
                },
                {
                    "value": 0.09395097863528659,
                    "original": 81.072
                },
                {
                    "value": 0.093955956434303,
                    "original": 81.071
                },
                {
                    "value": 0.09452840332118748,
                    "original": 80.956
                },
                {
                    "value": 0.0945582701152858,
                    "original": 80.95
                },
                {
                    "value": 0.09503116102184254,
                    "original": 80.855
                },
                {
                    "value": 0.09568823049200564,
                    "original": 80.723
                },
                {
                    "value": 0.09595205383987414,
                    "original": 80.67
                },
                {
                    "value": 0.09622583278577546,
                    "original": 80.615
                },
                {
                    "value": 0.09699739163331543,
                    "original": 80.46
                },
                {
                    "value": 0.09776397268183899,
                    "original": 80.306
                },
                {
                    "value": 0.09787348426019947,
                    "original": 80.284
                },
                {
                    "value": 0.09790335105429779,
                    "original": 80.278
                },
                {
                    "value": 0.09795312904446168,
                    "original": 80.268
                },
                {
                    "value": 0.09818708559823186,
                    "original": 80.221
                },
                {
                    "value": 0.09831650837265797,
                    "original": 80.195
                },
                {
                    "value": 0.09832646397069071,
                    "original": 80.193
                },
                {
                    "value": 0.0988541106664277,
                    "original": 80.087
                },
                {
                    "value": 0.09905820042609954,
                    "original": 80.046
                },
                {
                    "value": 0.09920255659757482,
                    "original": 80.017
                },
                {
                    "value": 0.09925233458773865,
                    "original": 80.007
                },
                {
                    "value": 0.10041713955757323,
                    "original": 79.773
                },
                {
                    "value": 0.10070585190052363,
                    "original": 79.715
                },
                {
                    "value": 0.10127829878740817,
                    "original": 79.6
                },
                {
                    "value": 0.10171634510085019,
                    "original": 79.512
                },
                {
                    "value": 0.10237839237002963,
                    "original": 79.379
                },
                {
                    "value": 0.1024032813651116,
                    "original": 79.374
                },
                {
                    "value": 0.10289608346773386,
                    "original": 79.275
                },
                {
                    "value": 0.10313999561953685,
                    "original": 79.226
                },
                {
                    "value": 0.10365768671724108,
                    "original": 79.122
                },
                {
                    "value": 0.10432471178543694,
                    "original": 78.988
                },
                {
                    "value": 0.10444417896183023,
                    "original": 78.964
                },
                {
                    "value": 0.10459849073133819,
                    "original": 78.933
                },
                {
                    "value": 0.10487226967723949,
                    "original": 78.878
                },
                {
                    "value": 0.10493200326543614,
                    "original": 78.866
                },
                {
                    "value": 0.10546960555920595,
                    "original": 78.758
                },
                {
                    "value": 0.10722179081297409,
                    "original": 78.406
                },
                {
                    "value": 0.10766979272444893,
                    "original": 78.316
                },
                {
                    "value": 0.1080779722437927,
                    "original": 78.234
                },
                {
                    "value": 0.108879397885431,
                    "original": 78.073
                },
                {
                    "value": 0.10918304362543056,
                    "original": 78.012
                },
                {
                    "value": 0.11007904744838024,
                    "original": 77.832
                },
                {
                    "value": 0.111233896820182,
                    "original": 77.6
                },
                {
                    "value": 0.1115922983493618,
                    "original": 77.528
                },
                {
                    "value": 0.11362324034804767,
                    "original": 77.12
                },
                {
                    "value": 0.11463373354837422,
                    "original": 76.917
                },
                {
                    "value": 0.11510164665591464,
                    "original": 76.823
                },
                {
                    "value": 0.11584831650837263,
                    "original": 76.673
                },
                {
                    "value": 0.11613702885132311,
                    "original": 76.615
                },
                {
                    "value": 0.11638591880214244,
                    "original": 76.565
                },
                {
                    "value": 0.11651534157656848,
                    "original": 76.539
                },
                {
                    "value": 0.11859108376640183,
                    "original": 76.122
                },
                {
                    "value": 0.1186309061585329,
                    "original": 76.114
                },
                {
                    "value": 0.12031838002508806,
                    "original": 75.775
                },
                {
                    "value": 0.12044282500049776,
                    "original": 75.75
                },
                {
                    "value": 0.12167731915656174,
                    "original": 75.502
                },
                {
                    "value": 0.12191127571033192,
                    "original": 75.455
                },
                {
                    "value": 0.12265296776377357,
                    "original": 75.306
                },
                {
                    "value": 0.12420106325786986,
                    "original": 74.995
                },
                {
                    "value": 0.124240885650001,
                    "original": 74.987
                },
                {
                    "value": 0.12433048603229598,
                    "original": 74.969
                },
                {
                    "value": 0.12458435378213165,
                    "original": 74.918
                },
                {
                    "value": 0.12495768870836067,
                    "original": 74.843
                },
                {
                    "value": 0.1250622224877048,
                    "original": 74.822
                },
                {
                    "value": 0.1253310236345897,
                    "original": 74.768
                },
                {
                    "value": 0.12542062401688467,
                    "original": 74.75
                },
                {
                    "value": 0.12603787109491663,
                    "original": 74.626
                },
                {
                    "value": 0.12692391931983357,
                    "original": 74.448
                },
                {
                    "value": 0.12726240965294786,
                    "original": 74.38
                },
                {
                    "value": 0.12844214801983153,
                    "original": 74.143
                },
                {
                    "value": 0.1286313043824542,
                    "original": 74.105
                },
                {
                    "value": 0.12988570973458377,
                    "original": 73.853
                },
                {
                    "value": 0.12993050992573124,
                    "original": 73.844
                },
                {
                    "value": 0.1299902435139279,
                    "original": 73.832
                },
                {
                    "value": 0.1302789558568783,
                    "original": 73.774
                },
                {
                    "value": 0.13070704657228757,
                    "original": 73.688
                },
                {
                    "value": 0.13087131393982834,
                    "original": 73.655
                },
                {
                    "value": 0.1318867849391713,
                    "original": 73.451
                },
                {
                    "value": 0.13335025784998905,
                    "original": 73.157
                },
                {
                    "value": 0.13364394799195586,
                    "original": 73.098
                },
                {
                    "value": 0.13398243832507017,
                    "original": 73.03
                },
                {
                    "value": 0.13410688330047987,
                    "original": 73.005
                },
                {
                    "value": 0.13493319793720007,
                    "original": 72.839
                },
                {
                    "value": 0.13526173267228161,
                    "original": 72.773
                },
                {
                    "value": 0.13660076060768966,
                    "original": 72.504
                },
                {
                    "value": 0.136784939171296,
                    "original": 72.467
                },
                {
                    "value": 0.13681480596539433,
                    "original": 72.461
                },
                {
                    "value": 0.1371980964896561,
                    "original": 72.384
                },
                {
                    "value": 0.13753658682277042,
                    "original": 72.316
                },
                {
                    "value": 0.13820361189096628,
                    "original": 72.182
                },
                {
                    "value": 0.13842263504768726,
                    "original": 72.138
                },
                {
                    "value": 0.13867152499850668,
                    "original": 72.088
                },
                {
                    "value": 0.1392141050912928,
                    "original": 71.979
                },
                {
                    "value": 0.1407323337912908,
                    "original": 71.674
                },
                {
                    "value": 0.1407373115903072,
                    "original": 71.673
                },
                {
                    "value": 0.14079206737948743,
                    "original": 71.662
                },
                {
                    "value": 0.14085180096768407,
                    "original": 71.65
                },
                {
                    "value": 0.1411305577126018,
                    "original": 71.594
                },
                {
                    "value": 0.14122015809489677,
                    "original": 71.576
                },
                {
                    "value": 0.141583537423093,
                    "original": 71.503
                },
                {
                    "value": 0.14250940804014098,
                    "original": 71.317
                },
                {
                    "value": 0.14318141090735317,
                    "original": 71.182
                },
                {
                    "value": 0.14327598908866457,
                    "original": 71.163
                },
                {
                    "value": 0.14346016765227082,
                    "original": 71.126
                },
                {
                    "value": 0.14372399100013938,
                    "original": 71.073
                },
                {
                    "value": 0.14382354698046712,
                    "original": 71.053
                },
                {
                    "value": 0.14555582103816975,
                    "original": 70.705
                },
                {
                    "value": 0.14572506620472686,
                    "original": 70.671
                },
                {
                    "value": 0.1460486231407921,
                    "original": 70.606
                },
                {
                    "value": 0.1463224020866933,
                    "original": 70.551
                },
                {
                    "value": 0.14666587021882402,
                    "original": 70.482
                },
                {
                    "value": 0.1470690719391514,
                    "original": 70.401
                },
                {
                    "value": 0.14753698504669172,
                    "original": 70.307
                },
                {
                    "value": 0.14786054198275686,
                    "original": 70.242
                },
                {
                    "value": 0.14827867710013337,
                    "original": 70.158
                },
                {
                    "value": 0.1485275670509527,
                    "original": 70.108
                },
                {
                    "value": 0.14894570216832922,
                    "original": 70.024
                },
                {
                    "value": 0.1492294367122633,
                    "original": 69.967
                },
                {
                    "value": 0.14936383728570574,
                    "original": 69.94
                },
                {
                    "value": 0.14992632857455745,
                    "original": 69.827
                },
                {
                    "value": 0.15004579575095076,
                    "original": 69.803
                },
                {
                    "value": 0.15038926388308146,
                    "original": 69.734
                },
                {
                    "value": 0.1509268661768512,
                    "original": 69.626
                },
                {
                    "value": 0.15229576090635763,
                    "original": 69.351
                },
                {
                    "value": 0.15393843458176532,
                    "original": 69.021
                },
                {
                    "value": 0.15429185831192876,
                    "original": 68.95
                },
                {
                    "value": 0.15461043744897757,
                    "original": 68.886
                },
                {
                    "value": 0.15466021543914138,
                    "original": 68.876
                },
                {
                    "value": 0.1555910638552058,
                    "original": 68.689
                },
                {
                    "value": 0.1558847539971726,
                    "original": 68.63
                },
                {
                    "value": 0.1563875116978277,
                    "original": 68.529
                },
                {
                    "value": 0.15738804930012143,
                    "original": 68.328
                },
                {
                    "value": 0.15759711685880967,
                    "original": 68.286
                },
                {
                    "value": 0.15760707245684244,
                    "original": 68.284
                },
                {
                    "value": 0.15809987455946475,
                    "original": 68.185
                },
                {
                    "value": 0.1585478764709396,
                    "original": 68.095
                },
                {
                    "value": 0.1589610337892997,
                    "original": 68.012
                },
                {
                    "value": 0.16016068335224895,
                    "original": 67.771
                },
                {
                    "value": 0.16028512832765865,
                    "original": 67.746
                },
                {
                    "value": 0.16043446229815025,
                    "original": 67.716
                },
                {
                    "value": 0.16142504430241125,
                    "original": 67.517
                },
                {
                    "value": 0.1629880731935567,
                    "original": 67.203
                },
                {
                    "value": 0.1636899428548673,
                    "original": 67.062
                },
                {
                    "value": 0.16427234533978458,
                    "original": 66.945
                },
                {
                    "value": 0.16447643509945642,
                    "original": 66.904
                },
                {
                    "value": 0.1649543038050295,
                    "original": 66.808
                },
                {
                    "value": 0.1659299524122414,
                    "original": 66.612
                },
                {
                    "value": 0.16640284331879818,
                    "original": 66.517
                },
                {
                    "value": 0.1666766222646994,
                    "original": 66.462
                },
                {
                    "value": 0.16698524580371538,
                    "original": 66.4
                },
                {
                    "value": 0.16768213766600956,
                    "original": 66.26
                },
                {
                    "value": 0.1686627640722378,
                    "original": 66.063
                },
                {
                    "value": 0.16871751986141803,
                    "original": 66.052
                },
                {
                    "value": 0.17030543774764548,
                    "original": 65.733
                },
                {
                    "value": 0.17108695219321826,
                    "original": 65.576
                },
                {
                    "value": 0.17118650817354597,
                    "original": 65.556
                },
                {
                    "value": 0.17137068673715225,
                    "original": 65.519
                },
                {
                    "value": 0.17139557573223424,
                    "original": 65.514
                },
                {
                    "value": 0.1715498875017422,
                    "original": 65.483
                },
                {
                    "value": 0.17204766740338093,
                    "original": 65.383
                },
                {
                    "value": 0.1723811799374788,
                    "original": 65.316
                },
                {
                    "value": 0.17312287199092047,
                    "original": 65.167
                },
                {
                    "value": 0.17321247237321544,
                    "original": 65.149
                },
                {
                    "value": 0.1741034983971487,
                    "original": 64.97
                },
                {
                    "value": 0.1756316826951795,
                    "original": 64.663
                },
                {
                    "value": 0.17597515082731022,
                    "original": 64.594
                },
                {
                    "value": 0.1762339963761623,
                    "original": 64.542
                },
                {
                    "value": 0.1763136411604245,
                    "original": 64.526
                },
                {
                    "value": 0.17649781972403078,
                    "original": 64.489
                },
                {
                    "value": 0.17666706489058798,
                    "original": 64.455
                },
                {
                    "value": 0.17719471158632497,
                    "original": 64.349
                },
                {
                    "value": 0.17721462278239053,
                    "original": 64.345
                },
                {
                    "value": 0.17775720287517668,
                    "original": 64.236
                },
                {
                    "value": 0.1779115146446847,
                    "original": 64.205
                },
                {
                    "value": 0.17799613722796326,
                    "original": 64.188
                },
                {
                    "value": 0.17821018258566793,
                    "original": 64.145
                },
                {
                    "value": 0.17879756286960155,
                    "original": 64.027
                },
                {
                    "value": 0.18035561396173067,
                    "original": 63.714
                },
                {
                    "value": 0.18047010333910754,
                    "original": 63.691
                },
                {
                    "value": 0.18074388228500882,
                    "original": 63.636
                },
                {
                    "value": 0.18103757242697568,
                    "original": 63.577
                },
                {
                    "value": 0.1817444198873026,
                    "original": 63.435
                },
                {
                    "value": 0.18197837644107281,
                    "original": 63.388
                },
                {
                    "value": 0.18204308782828582,
                    "original": 63.375
                },
                {
                    "value": 0.18221731079385936,
                    "original": 63.34
                },
                {
                    "value": 0.18262549031320308,
                    "original": 63.258
                },
                {
                    "value": 0.1827798020827111,
                    "original": 63.227
                },
                {
                    "value": 0.18344184935189053,
                    "original": 63.094
                },
                {
                    "value": 0.18355136093025104,
                    "original": 63.072
                },
                {
                    "value": 0.18483563307647888,
                    "original": 62.814
                },
                {
                    "value": 0.18497501144893772,
                    "original": 62.786
                },
                {
                    "value": 0.18512434541942932,
                    "original": 62.756
                },
                {
                    "value": 0.18625928359516555,
                    "original": 62.528
                },
                {
                    "value": 0.18645839555582103,
                    "original": 62.488
                },
                {
                    "value": 0.18700595344762358,
                    "original": 62.378
                },
                {
                    "value": 0.187075642633853,
                    "original": 62.364
                },
                {
                    "value": 0.18732453258467235,
                    "original": 62.314
                },
                {
                    "value": 0.18770284530991774,
                    "original": 62.238
                },
                {
                    "value": 0.18854907114270353,
                    "original": 62.068
                },
                {
                    "value": 0.1887133385102443,
                    "original": 62.035
                },
                {
                    "value": 0.18903191764729307,
                    "original": 61.971
                },
                {
                    "value": 0.19013201122991455,
                    "original": 61.75
                },
                {
                    "value": 0.1903062341954881,
                    "original": 61.715
                },
                {
                    "value": 0.19074428050893014,
                    "original": 61.627
                },
                {
                    "value": 0.19140632777810962,
                    "original": 61.494
                },
                {
                    "value": 0.19150588375843736,
                    "original": 61.474
                },
                {
                    "value": 0.19203850825319077,
                    "original": 61.367
                },
                {
                    "value": 0.19210819743942015,
                    "original": 61.353
                },
                {
                    "value": 0.1921330864345021,
                    "original": 61.348
                },
                {
                    "value": 0.19303406805646814,
                    "original": 61.167
                },
                {
                    "value": 0.19440794058499092,
                    "original": 60.891
                },
                {
                    "value": 0.19488580929056407,
                    "original": 60.795
                },
                {
                    "value": 0.195682257133186,
                    "original": 60.635
                },
                {
                    "value": 0.19699141827449573,
                    "original": 60.372
                },
                {
                    "value": 0.1970063516715449,
                    "original": 60.369
                },
                {
                    "value": 0.19836031300400211,
                    "original": 60.097
                },
                {
                    "value": 0.1991219162535093,
                    "original": 59.944
                },
                {
                    "value": 0.20071978973776955,
                    "original": 59.623
                },
                {
                    "value": 0.20094379069350693,
                    "original": 59.578
                },
                {
                    "value": 0.20180992772235826,
                    "original": 59.404
                },
                {
                    "value": 0.20257650877088185,
                    "original": 59.25
                },
                {
                    "value": 0.20262130896202935,
                    "original": 59.241
                },
                {
                    "value": 0.20324851163809407,
                    "original": 59.115
                },
                {
                    "value": 0.2038558031180933,
                    "original": 58.993
                },
                {
                    "value": 0.20624514664595903,
                    "original": 58.513
                },
                {
                    "value": 0.20638452501841784,
                    "original": 58.485
                },
                {
                    "value": 0.2065089699938275,
                    "original": 58.46
                },
                {
                    "value": 0.20713617266989223,
                    "original": 58.334
                },
                {
                    "value": 0.207171017263007,
                    "original": 58.327
                },
                {
                    "value": 0.20751448539513764,
                    "original": 58.258
                },
                {
                    "value": 0.20819644386038266,
                    "original": 58.121
                },
                {
                    "value": 0.20895306931087348,
                    "original": 57.969
                },
                {
                    "value": 0.2095155605997252,
                    "original": 57.856
                },
                {
                    "value": 0.2096648945702168,
                    "original": 57.826
                },
                {
                    "value": 0.20967982796726597,
                    "original": 57.823
                },
                {
                    "value": 0.21025725265316686,
                    "original": 57.707
                },
                {
                    "value": 0.2108048105449694,
                    "original": 57.597
                },
                {
                    "value": 0.21132747944169006,
                    "original": 57.492
                },
                {
                    "value": 0.2134380662246381,
                    "original": 57.068
                },
                {
                    "value": 0.21397566851840788,
                    "original": 56.96
                },
                {
                    "value": 0.2147223383708659,
                    "original": 56.81
                },
                {
                    "value": 0.21561336439479917,
                    "original": 56.631
                },
                {
                    "value": 0.21572287597315967,
                    "original": 56.609
                },
                {
                    "value": 0.21576767616430717,
                    "original": 56.6
                },
                {
                    "value": 0.21635007864922445,
                    "original": 56.483
                },
                {
                    "value": 0.21688270314397784,
                    "original": 56.376
                },
                {
                    "value": 0.2179230631384027,
                    "original": 56.167
                },
                {
                    "value": 0.218107241702009,
                    "original": 56.13
                },
                {
                    "value": 0.2188389781574179,
                    "original": 55.983
                },
                {
                    "value": 0.21983453796069527,
                    "original": 55.783
                },
                {
                    "value": 0.21999382752921967,
                    "original": 55.751
                },
                {
                    "value": 0.22010831690659655,
                    "original": 55.728
                },
                {
                    "value": 0.22115863249905418,
                    "original": 55.517
                },
                {
                    "value": 0.22120841048921808,
                    "original": 55.507
                },
                {
                    "value": 0.22199490273380723,
                    "original": 55.349
                },
                {
                    "value": 0.22353304262987075,
                    "original": 55.04
                },
                {
                    "value": 0.22459331382036118,
                    "original": 54.827
                },
                {
                    "value": 0.22471278099675446,
                    "original": 54.803
                },
                {
                    "value": 0.22564362941281882,
                    "original": 54.616
                },
                {
                    "value": 0.22607669792724444,
                    "original": 54.529
                },
                {
                    "value": 0.22662923361806342,
                    "original": 54.418
                },
                {
                    "value": 0.2285058638472413,
                    "original": 54.041
                },
                {
                    "value": 0.22889413217051946,
                    "original": 53.963
                },
                {
                    "value": 0.22958106843478085,
                    "original": 53.825
                },
                {
                    "value": 0.2296806244151086,
                    "original": 53.805
                },
                {
                    "value": 0.22980506939051826,
                    "original": 53.78
                },
                {
                    "value": 0.23184596698723692,
                    "original": 53.37
                },
                {
                    "value": 0.23212970153117093,
                    "original": 53.313
                },
                {
                    "value": 0.23299583856002226,
                    "original": 53.139
                },
                {
                    "value": 0.23345877386854627,
                    "original": 53.046
                },
                {
                    "value": 0.23401628735838162,
                    "original": 52.934
                },
                {
                    "value": 0.23449415606395474,
                    "original": 52.838
                },
                {
                    "value": 0.23487744658821652,
                    "original": 52.761
                },
                {
                    "value": 0.23521095912231443,
                    "original": 52.694
                },
                {
                    "value": 0.23561913864165818,
                    "original": 52.612
                },
                {
                    "value": 0.23657985385182087,
                    "original": 52.419
                },
                {
                    "value": 0.2371871453318201,
                    "original": 52.297
                },
                {
                    "value": 0.2376251916452621,
                    "original": 52.209
                },
                {
                    "value": 0.23862572924755587,
                    "original": 52.008
                },
                {
                    "value": 0.2392728431196862,
                    "original": 51.878
                },
                {
                    "value": 0.23939231029607946,
                    "original": 51.854
                },
                {
                    "value": 0.23948191067837443,
                    "original": 51.836
                },
                {
                    "value": 0.23955159986460384,
                    "original": 51.822
                },
                {
                    "value": 0.23965115584493157,
                    "original": 51.802
                },
                {
                    "value": 0.2398652012026362,
                    "original": 51.759
                },
                {
                    "value": 0.2402136471337833,
                    "original": 51.689
                },
                {
                    "value": 0.24092049459411027,
                    "original": 51.547
                },
                {
                    "value": 0.24100013937837245,
                    "original": 51.531
                },
                {
                    "value": 0.2421997889413217,
                    "original": 51.29
                },
                {
                    "value": 0.2428021026223045,
                    "original": 51.169
                },
                {
                    "value": 0.24281205822033727,
                    "original": 51.167
                },
                {
                    "value": 0.2444696652927941,
                    "original": 50.834
                },
                {
                    "value": 0.24460904366525296,
                    "original": 50.806
                },
                {
                    "value": 0.2467146526491846,
                    "original": 50.383
                },
                {
                    "value": 0.24863608306950996,
                    "original": 49.997
                },
                {
                    "value": 0.24878043924098517,
                    "original": 49.968
                },
                {
                    "value": 0.24890986201541124,
                    "original": 49.942
                },
                {
                    "value": 0.24990542181868863,
                    "original": 49.742
                },
                {
                    "value": 0.2501045337793441,
                    "original": 49.702
                },
                {
                    "value": 0.2501393783724588,
                    "original": 49.695
                },
                {
                    "value": 0.2511648049698345,
                    "original": 49.489
                },
                {
                    "value": 0.2521553869740955,
                    "original": 49.29
                },
                {
                    "value": 0.25275272285606193,
                    "original": 49.17
                },
                {
                    "value": 0.25350934830655275,
                    "original": 49.018
                },
                {
                    "value": 0.254773709256715,
                    "original": 48.764
                },
                {
                    "value": 0.25530633375146844,
                    "original": 48.657
                },
                {
                    "value": 0.2559335364275332,
                    "original": 48.531
                },
                {
                    "value": 0.25593851422654956,
                    "original": 48.53
                },
                {
                    "value": 0.25604802580491004,
                    "original": 48.508
                },
                {
                    "value": 0.2570386078091711,
                    "original": 48.309
                },
                {
                    "value": 0.25864643689146405,
                    "original": 47.986
                },
                {
                    "value": 0.25949764052326624,
                    "original": 47.815
                },
                {
                    "value": 0.26126475917408354,
                    "original": 47.46
                },
                {
                    "value": 0.26230014136949203,
                    "original": 47.252
                },
                {
                    "value": 0.2623847639527706,
                    "original": 47.235
                },
                {
                    "value": 0.26249427553113114,
                    "original": 47.213
                },
                {
                    "value": 0.2629024550504749,
                    "original": 47.131
                },
                {
                    "value": 0.26440575035342373,
                    "original": 46.829
                },
                {
                    "value": 0.2646347291081775,
                    "original": 46.783
                },
                {
                    "value": 0.2646894848973578,
                    "original": 46.772
                },
                {
                    "value": 0.26484379666686575,
                    "original": 46.741
                },
                {
                    "value": 0.26569500029866794,
                    "original": 46.57
                },
                {
                    "value": 0.2662077135973558,
                    "original": 46.467
                },
                {
                    "value": 0.26699420584194494,
                    "original": 46.309
                },
                {
                    "value": 0.26765625311112434,
                    "original": 46.176
                },
                {
                    "value": 0.2704139537662027,
                    "original": 45.622
                },
                {
                    "value": 0.27086693347669394,
                    "original": 45.531
                },
                {
                    "value": 0.270931644863907,
                    "original": 45.518
                },
                {
                    "value": 0.2740626804452143,
                    "original": 44.889
                },
                {
                    "value": 0.27433645939111556,
                    "original": 44.834
                },
                {
                    "value": 0.27535690818947495,
                    "original": 44.629
                },
                {
                    "value": 0.27553113115504846,
                    "original": 44.594
                },
                {
                    "value": 0.27557593134619596,
                    "original": 44.585
                },
                {
                    "value": 0.27951834816717436,
                    "original": 43.793
                },
                {
                    "value": 0.2836449435517591,
                    "original": 42.964
                },
                {
                    "value": 0.2838092109192999,
                    "original": 42.931
                },
                {
                    "value": 0.2854120622025765,
                    "original": 42.609
                },
                {
                    "value": 0.285675885550445,
                    "original": 42.556
                },
                {
                    "value": 0.2869302909025745,
                    "original": 42.304
                },
                {
                    "value": 0.2879905620930649,
                    "original": 42.091
                },
                {
                    "value": 0.29011110447404576,
                    "original": 41.665
                },
                {
                    "value": 0.2902007048563407,
                    "original": 41.647
                },
                {
                    "value": 0.29147004360551937,
                    "original": 41.392
                },
                {
                    "value": 0.2932072954622384,
                    "original": 41.043
                },
                {
                    "value": 0.2940833880891225,
                    "original": 40.867
                },
                {
                    "value": 0.2959799295143659,
                    "original": 40.486
                },
                {
                    "value": 0.2959849073133823,
                    "original": 40.485
                },
                {
                    "value": 0.298837186149772,
                    "original": 39.912
                },
                {
                    "value": 0.2988819863409195,
                    "original": 39.903
                },
                {
                    "value": 0.29905123150747664,
                    "original": 39.869
                },
                {
                    "value": 0.2997033231786233,
                    "original": 39.738
                },
                {
                    "value": 0.30013639169304895,
                    "original": 39.651
                },
                {
                    "value": 0.3003603926487864,
                    "original": 39.606
                },
                {
                    "value": 0.30102243991796584,
                    "original": 39.473
                },
                {
                    "value": 0.30192342153993185,
                    "original": 39.292
                },
                {
                    "value": 0.3050345459251737,
                    "original": 38.667
                },
                {
                    "value": 0.30604006132648387,
                    "original": 38.465
                },
                {
                    "value": 0.30702566553172844,
                    "original": 38.267
                },
                {
                    "value": 0.30795651394779283,
                    "original": 38.08
                },
                {
                    "value": 0.31435796348286643,
                    "original": 36.794
                },
                {
                    "value": 0.3146566314238496,
                    "original": 36.734
                },
                {
                    "value": 0.31502001075204583,
                    "original": 36.661
                },
                {
                    "value": 0.3158363697907333,
                    "original": 36.497
                },
                {
                    "value": 0.31644366127073253,
                    "original": 36.375
                },
                {
                    "value": 0.31662286203532247,
                    "original": 36.339
                },
                {
                    "value": 0.31725006471138717,
                    "original": 36.213
                },
                {
                    "value": 0.31730979829958383,
                    "original": 36.201
                },
                {
                    "value": 0.3190619835533521,
                    "original": 35.849
                },
                {
                    "value": 0.32351213587400196,
                    "original": 34.955
                },
                {
                    "value": 0.32466200744678736,
                    "original": 34.724
                },
                {
                    "value": 0.3251996097405571,
                    "original": 34.616
                },
                {
                    "value": 0.32627979212711306,
                    "original": 34.399
                },
                {
                    "value": 0.32841029010612666,
                    "original": 33.971
                },
                {
                    "value": 0.3307100332516974,
                    "original": 33.509
                },
                {
                    "value": 0.3308942118153037,
                    "original": 33.472
                },
                {
                    "value": 0.3317105708539912,
                    "original": 33.308
                },
                {
                    "value": 0.33224817314776095,
                    "original": 33.2
                },
                {
                    "value": 0.33331342213726783,
                    "original": 32.986
                },
                {
                    "value": 0.3340551141907094,
                    "original": 32.837
                },
                {
                    "value": 0.3341297811759552,
                    "original": 32.822
                },
                {
                    "value": 0.33627521255201803,
                    "original": 32.391
                },
                {
                    "value": 0.3366336140811978,
                    "original": 32.319
                },
                {
                    "value": 0.34218883778348563,
                    "original": 31.203
                },
                {
                    "value": 0.3428658184497142,
                    "original": 31.067
                },
                {
                    "value": 0.3448868048503673,
                    "original": 30.661
                },
                {
                    "value": 0.34523027298249803,
                    "original": 30.592
                },
                {
                    "value": 0.34664396790315194,
                    "original": 30.308
                },
                {
                    "value": 0.3474752603388886,
                    "original": 30.141
                },
                {
                    "value": 0.3540359994424864,
                    "original": 28.823
                },
                {
                    "value": 0.35404097724150285,
                    "original": 28.822
                },
                {
                    "value": 0.3549021364713378,
                    "original": 28.649
                },
                {
                    "value": 0.3574308583716624,
                    "original": 28.141
                },
                {
                    "value": 0.35747068076379346,
                    "original": 28.133
                },
                {
                    "value": 0.3587350417139557,
                    "original": 27.879
                },
                {
                    "value": 0.3608954064870677,
                    "original": 27.445
                },
                {
                    "value": 0.36157238715329626,
                    "original": 27.309
                },
                {
                    "value": 0.36256794695657363,
                    "original": 27.109
                },
                {
                    "value": 0.3634788841765724,
                    "original": 26.926
                },
                {
                    "value": 0.36518129144017675,
                    "original": 26.584
                },
                {
                    "value": 0.36709774406148576,
                    "original": 26.199
                },
                {
                    "value": 0.36784939171296016,
                    "original": 26.048
                },
                {
                    "value": 0.3682227266391892,
                    "original": 25.973
                },
                {
                    "value": 0.3700097564860721,
                    "original": 25.614
                },
                {
                    "value": 0.37009935686836704,
                    "original": 25.596
                },
                {
                    "value": 0.37056726997590744,
                    "original": 25.502
                },
                {
                    "value": 0.3707962487306612,
                    "original": 25.456
                },
                {
                    "value": 0.3714632737988571,
                    "original": 25.322
                },
                {
                    "value": 0.3720108316906596,
                    "original": 25.212
                },
                {
                    "value": 0.3725932341755769,
                    "original": 25.095
                },
                {
                    "value": 0.37530115684049137,
                    "original": 24.551
                },
                {
                    "value": 0.37633653903589986,
                    "original": 24.343
                },
                {
                    "value": 0.377650677976226,
                    "original": 24.079
                },
                {
                    "value": 0.3797513091611413,
                    "original": 23.657
                },
                {
                    "value": 0.3815731836011389,
                    "original": 23.291
                },
                {
                    "value": 0.38558031180933033,
                    "original": 22.486
                },
                {
                    "value": 0.3878750771558847,
                    "original": 22.025
                },
                {
                    "value": 0.39353483463751665,
                    "original": 20.888
                },
                {
                    "value": 0.40164366923521094,
                    "original": 19.259
                },
                {
                    "value": 0.4018278477988172,
                    "original": 19.222
                },
                {
                    "value": 0.40368456683192955,
                    "original": 18.849
                },
                {
                    "value": 0.4058399538060251,
                    "original": 18.416
                },
                {
                    "value": 0.4071341815502857,
                    "original": 18.156
                },
                {
                    "value": 0.4085478764709396,
                    "original": 17.872
                },
                {
                    "value": 0.4096230810584791,
                    "original": 17.656
                },
                {
                    "value": 0.4104493956951994,
                    "original": 17.49
                },
                {
                    "value": 0.41133046612109986,
                    "original": 17.313
                },
                {
                    "value": 0.41233598152241,
                    "original": 17.111
                },
                {
                    "value": 0.41972801306174456,
                    "original": 15.626
                },
                {
                    "value": 0.4216643768791191,
                    "original": 15.237
                },
                {
                    "value": 0.4293152539673058,
                    "original": 13.7
                },
                {
                    "value": 0.4342681639886108,
                    "original": 12.705
                },
                {
                    "value": 0.43488541106664275,
                    "original": 12.581
                },
                {
                    "value": 0.4351691456105768,
                    "original": 12.524
                },
                {
                    "value": 0.43728968799155765,
                    "original": 12.098
                },
                {
                    "value": 0.4380264022459829,
                    "original": 11.95
                },
                {
                    "value": 0.4401917448181112,
                    "original": 11.515
                },
                {
                    "value": 0.44892280429285386,
                    "original": 9.761
                },
                {
                    "value": 0.4538956255102244,
                    "original": 8.762
                },
                {
                    "value": 0.4569569719053023,
                    "original": 8.147
                },
                {
                    "value": 0.4572257730521872,
                    "original": 8.093
                },
                {
                    "value": 0.46139716862791946,
                    "original": 7.255
                },
                {
                    "value": 0.4624026840292296,
                    "original": 7.053
                },
                {
                    "value": 0.4705812078131533,
                    "original": 5.41
                },
                {
                    "value": 0.47784381657806185,
                    "original": 3.951
                },
                {
                    "value": 0.4796507576210103,
                    "original": 3.588
                },
                {
                    "value": 0.48097982995838556,
                    "original": 3.321
                },
                {
                    "value": 0.48111423053182806,
                    "original": 3.294
                },
                {
                    "value": 0.484857535392151,
                    "original": 2.542
                },
                {
                    "value": 0.4849620691714951,
                    "original": 2.521
                },
                {
                    "value": 0.4856639388328057,
                    "original": 2.38
                },
                {
                    "value": 0.48604722935706746,
                    "original": 2.303
                },
                {
                    "value": 0.4923341895147641,
                    "original": 1.04
                },
                {
                    "value": 0.49234912291181326,
                    "original": 1.037
                },
                {
                    "value": 0.4978943910160683,
                    "original": -0.077
                },
                {
                    "value": 0.5004928021026223,
                    "original": -0.599
                },
                {
                    "value": 0.5068295402504828,
                    "original": -1.872
                },
                {
                    "value": 0.5094777293272006,
                    "original": -2.404
                },
                {
                    "value": 0.5188658582721064,
                    "original": -4.29
                },
                {
                    "value": 0.5327837843219242,
                    "original": -7.086
                },
                {
                    "value": 0.5346106365609382,
                    "original": -7.453
                },
                {
                    "value": 0.5351183720606096,
                    "original": -7.555
                },
                {
                    "value": 0.5369999800888039,
                    "original": -7.933
                },
                {
                    "value": 0.5425800927861737,
                    "original": -9.054
                },
                {
                    "value": 0.5467116659697747,
                    "original": -9.884
                },
                {
                    "value": 0.5545865440136989,
                    "original": -11.466
                },
                {
                    "value": 0.6149423570873902,
                    "original": -23.591
                },
                {
                    "value": 0.6270682754913087,
                    "original": -26.027
                },
                {
                    "value": 0.6337385261732672,
                    "original": -27.367
                },
                {
                    "value": 0.6648099476335544,
                    "original": -33.609
                },
                {
                    "value": 0.6701809927722359,
                    "original": -34.688
                },
                {
                    "value": 0.7229108177528224,
                    "original": -45.281
                },
                {
                    "value": 0.7277392827987177,
                    "original": -46.251
                },
                {
                    "value": 0.9999999999999999,
                    "original": -100.946
                }
            ]);

        });

    });

})


// common crawl pagerank data:
// https://commoncrawl.org/2020/02/host-and-domain-level-web-graphs-novdecjan-2019-2020/

const TEST_DATA_FROM_PAGERANK = [
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

const TEST_DATA_FROM_OPENAI_SEARCH = [
    226.001,
    194.994,
    192.001,
    188.298,
    183.254,
    182.309,
    181.963,
    177.795,
    176.084,
    175.549,
    172.785,
    171.826,
    169.671,
    169.031,
    168.953,
    168.157,
    167.831,
    167.201,
    167.187,
    166.549,
    165.077,
    164.92,
    163.798,
    163.048,
    162.726,
    162.65,
    162.475,
    161.215,
    160.397,
    160.331,
    160.295,
    159.953,
    159.839,
    159.711,
    159.06,
    158.2,
    157.404,
    157.094,
    156.667,
    156.647,
    155.762,
    154.5,
    154.158,
    152.035,
    150.323,
    150.014,
    149.716,
    149.657,
    149.496,
    149.435,
    148.581,
    148.352,
    148.004,
    147.997,
    147.266,
    147.067,
    146.957,
    145.832,
    145.827,
    145.715,
    145.413,
    145.259,
    145.025,
    144.922,
    144.92,
    144.912,
    144.731,
    144.28,
    144.13,
    144.047,
    143.594,
    143.185,
    143.056,
    142.461,
    141.995,
    141.869,
    141.317,
    141.15,
    141.117,
    140.822,
    140.683,
    140.655,
    140.471,
    140.411,
    139.616,
    139.595,
    139.488,
    139.403,
    139.027,
    138.656,
    138.65,
    138.542,
    138.071,
    137.935,
    137.872,
    137.765,
    137.53,
    136.972,
    136.899,
    136.532,
    136.496,
    136.294,
    136.277,
    136.251,
    135.942,
    135.36,
    135.357,
    135.141,
    134.723,
    134.7,
    134.689,
    134.54,
    134.32,
    134.029,
    133.764,
    133.584,
    133.572,
    133.23,
    133.024,
    132.888,
    132.419,
    132.376,
    132.268,
    132.061,
    131.939,
    131.191,
    131.064,
    131.018,
    130.911,
    130.791,
    130.462,
    130.398,
    129.993,
    129.891,
    129.864,
    129.804,
    129.704,
    129.636,
    129.623,
    129.458,
    129.216,
    129.015,
    128.869,
    128.825,
    128.734,
    128.688,
    128.463,
    128.414,
    128.167,
    127.982,
    127.974,
    127.943,
    127.825,
    127.745,
    127.424,
    127.398,
    127.144,
    126.978,
    126.957,
    126.804,
    126.7,
    126.674,
    126.518,
    126.441,
    126.385,
    126.356,
    126.316,
    126.276,
    126.15,
    125.806,
    125.762,
    125.614,
    125.604,
    125.226,
    125.079,
    125.063,
    124.867,
    124.608,
    124.559,
    124.478,
    124.323,
    124.316,
    124.085,
    124.084,
    123.972,
    123.968,
    123.885,
    123.677,
    123.408,
    123.338,
    122.91,
    122.882,
    122.571,
    122.512,
    122.449,
    122.396,
    121.863,
    121.803,
    121.765,
    121.7,
    121.641,
    121.521,
    121.501,
    121.46,
    121.381,
    121.357,
    121.336,
    121.182,
    121.138,
    120.913,
    120.8,
    120.59,
    120.436,
    120.423,
    120.194,
    119.937,
    119.862,
    119.858,
    119.784,
    119.772,
    119.605,
    119.417,
    119.113,
    119.055,
    119.041,
    118.89,
    118.832,
    118.788,
    118.682,
    118.497,
    118.453,
    118.441,
    118.35,
    118.248,
    118.154,
    118.039,
    117.975,
    117.536,
    117.305,
    116.948,
    116.232,
    116.176,
    116.123,
    116.026,
    116.016,
    115.811,
    115.779,
    115.473,
    115.282,
    115.264,
    115.193,
    115.039,
    114.758,
    114.6,
    114.455,
    114.443,
    114.348,
    114.195,
    114.015,
    113.904,
    113.851,
    113.831,
    113.74,
    113.573,
    113.405,
    112.778,
    112.694,
    112.692,
    112.628,
    112.354,
    112.354,
    112.25,
    112.067,
    111.968,
    111.669,
    111.502,
    111.301,
    111.192,
    111.162,
    111.134,
    111.131,
    111.054,
    111.004,
    110.82,
    110.657,
    110.645,
    110.547,
    110.224,
    110.008,
    109.891,
    109.816,
    109.76,
    109.582,
    109.506,
    109.394,
    109.309,
    109.292,
    109.24,
    109.183,
    108.563,
    108.554,
    108.529,
    108.339,
    108.26,
    108.245,
    108.067,
    108.035,
    107.719,
    107.64,
    107.628,
    107.57,
    107.319,
    107.298,
    107.154,
    107.142,
    107.115,
    107.039,
    106.927,
    106.868,
    106.797,
    106.546,
    106.535,
    106.535,
    106.414,
    106.393,
    106.382,
    106.351,
    105.884,
    105.795,
    105.78,
    105.723,
    105.661,
    105.59,
    105.479,
    105.459,
    105.393,
    105.056,
    104.939,
    104.833,
    104.765,
    104.519,
    104.44,
    104.258,
    104.235,
    104.055,
    104.009,
    103.801,
    103.781,
    103.766,
    103.755,
    103.357,
    103.247,
    103.059,
    102.871,
    102.817,
    102.755,
    102.697,
    102.646,
    102.646,
    102.639,
    102.431,
    102.415,
    102.373,
    102.372,
    102.293,
    102.014,
    102.009,
    101.879,
    101.816,
    101.738,
    101.625,
    101.524,
    101.519,
    101.45,
    101.326,
    101.199,
    101.164,
    101.129,
    101.121,
    101.094,
    101.025,
    100.97,
    100.836,
    100.645,
    100.42,
    100.381,
    100.173,
    99.992,
    99.869,
    99.588,
    99.369,
    99.301,
    99.103,
    99.102,
    99.038,
    98.959,
    98.829,
    98.64,
    98.634,
    98.58,
    98.515,
    97.88,
    97.709,
    97.445,
    97.32,
    97.161,
    97.082,
    96.942,
    96.928,
    96.871,
    96.812,
    96.764,
    96.747,
    96.691,
    96.674,
    96.6,
    96.576,
    96.42,
    96.145,
    96.067,
    96.041,
    95.839,
    95.789,
    95.712,
    95.686,
    95.628,
    95.579,
    95.551,
    95.429,
    95.397,
    95.392,
    95.3,
    95.223,
    95.216,
    95.101,
    95.005,
    94.986,
    94.918,
    94.857,
    94.75,
    94.724,
    94.716,
    94.674,
    94.634,
    94.61,
    94.59,
    94.589,
    94.566,
    94.287,
    94.281,
    94.133,
    94.055,
    94.043,
    93.977,
    93.962,
    93.77,
    93.769,
    93.633,
    93.492,
    93.43,
    93.294,
    93.076,
    93.037,
    93.025,
    93.007,
    92.759,
    92.759,
    92.735,
    92.577,
    92.442,
    92.419,
    92.2,
    92.141,
    92.14,
    92.111,
    92.059,
    91.949,
    91.868,
    91.741,
    91.622,
    91.579,
    91.468,
    91.402,
    91.315,
    90.824,
    90.771,
    90.682,
    90.66,
    90.478,
    90.461,
    90.28,
    89.882,
    89.518,
    89.207,
    89.181,
    89.106,
    88.905,
    88.828,
    88.584,
    88.492,
    88.148,
    88,
    87.766,
    87.604,
    87.573,
    87.453,
    87.386,
    87.093,
    86.943,
    86.795,
    86.774,
    86.763,
    86.698,
    86.594,
    86.441,
    86.399,
    86.378,
    86.344,
    86.231,
    86.208,
    86.206,
    86.081,
    86.043,
    85.792,
    85.707,
    85.447,
    85.434,
    85.403,
    85.393,
    85.385,
    85.331,
    84.995,
    84.912,
    84.788,
    84.752,
    84.739,
    84.618,
    84.571,
    84.566,
    84.404,
    84.234,
    84.22,
    84.2,
    84.074,
    84.038,
    84.035,
    83.978,
    83.511,
    83.507,
    83.486,
    83.397,
    83.385,
    83.363,
    82.869,
    82.834,
    82.696,
    82.665,
    82.476,
    82.365,
    82.333,
    82.213,
    82.057,
    82.055,
    81.956,
    81.869,
    81.816,
    81.722,
    81.569,
    81.511,
    81.493,
    81.437,
    81.416,
    81.405,
    81.254,
    81.244,
    81.072,
    81.071,
    80.956,
    80.95,
    80.855,
    80.723,
    80.67,
    80.615,
    80.46,
    80.306,
    80.284,
    80.278,
    80.268,
    80.221,
    80.195,
    80.193,
    80.087,
    80.046,
    80.017,
    80.007,
    79.773,
    79.715,
    79.6,
    79.512,
    79.379,
    79.374,
    79.275,
    79.226,
    79.122,
    78.988,
    78.964,
    78.933,
    78.878,
    78.866,
    78.758,
    78.406,
    78.316,
    78.234,
    78.073,
    78.012,
    77.832,
    77.6,
    77.528,
    77.12,
    76.917,
    76.823,
    76.673,
    76.615,
    76.565,
    76.539,
    76.122,
    76.114,
    75.775,
    75.75,
    75.502,
    75.455,
    75.306,
    74.995,
    74.987,
    74.969,
    74.918,
    74.843,
    74.822,
    74.768,
    74.75,
    74.626,
    74.448,
    74.38,
    74.143,
    74.105,
    73.853,
    73.844,
    73.832,
    73.774,
    73.688,
    73.655,
    73.451,
    73.157,
    73.098,
    73.03,
    73.005,
    72.839,
    72.773,
    72.504,
    72.467,
    72.461,
    72.384,
    72.316,
    72.182,
    72.138,
    72.088,
    71.979,
    71.674,
    71.673,
    71.662,
    71.65,
    71.594,
    71.576,
    71.503,
    71.317,
    71.182,
    71.163,
    71.126,
    71.073,
    71.053,
    70.705,
    70.671,
    70.606,
    70.551,
    70.482,
    70.401,
    70.307,
    70.242,
    70.158,
    70.108,
    70.024,
    69.967,
    69.94,
    69.827,
    69.803,
    69.734,
    69.626,
    69.351,
    69.021,
    68.95,
    68.886,
    68.876,
    68.689,
    68.63,
    68.529,
    68.328,
    68.286,
    68.284,
    68.185,
    68.095,
    68.012,
    67.771,
    67.746,
    67.716,
    67.517,
    67.203,
    67.062,
    66.945,
    66.904,
    66.808,
    66.612,
    66.517,
    66.462,
    66.4,
    66.26,
    66.063,
    66.052,
    65.733,
    65.576,
    65.556,
    65.519,
    65.514,
    65.483,
    65.383,
    65.316,
    65.167,
    65.149,
    64.97,
    64.663,
    64.594,
    64.542,
    64.526,
    64.489,
    64.455,
    64.349,
    64.345,
    64.236,
    64.205,
    64.188,
    64.145,
    64.027,
    63.714,
    63.691,
    63.636,
    63.577,
    63.435,
    63.388,
    63.375,
    63.34,
    63.258,
    63.227,
    63.094,
    63.072,
    62.814,
    62.786,
    62.756,
    62.528,
    62.488,
    62.378,
    62.364,
    62.314,
    62.238,
    62.068,
    62.035,
    61.971,
    61.75,
    61.715,
    61.627,
    61.494,
    61.474,
    61.367,
    61.353,
    61.348,
    61.167,
    60.891,
    60.795,
    60.635,
    60.372,
    60.369,
    60.097,
    59.944,
    59.623,
    59.578,
    59.404,
    59.25,
    59.241,
    59.115,
    58.993,
    58.513,
    58.485,
    58.46,
    58.334,
    58.327,
    58.258,
    58.121,
    57.969,
    57.856,
    57.826,
    57.823,
    57.707,
    57.597,
    57.492,
    57.068,
    56.96,
    56.81,
    56.631,
    56.609,
    56.6,
    56.483,
    56.376,
    56.167,
    56.13,
    55.983,
    55.783,
    55.751,
    55.728,
    55.517,
    55.507,
    55.349,
    55.04,
    54.827,
    54.803,
    54.616,
    54.529,
    54.418,
    54.041,
    53.963,
    53.825,
    53.805,
    53.78,
    53.37,
    53.313,
    53.139,
    53.046,
    52.934,
    52.838,
    52.761,
    52.694,
    52.612,
    52.419,
    52.297,
    52.209,
    52.008,
    51.878,
    51.854,
    51.836,
    51.822,
    51.802,
    51.759,
    51.689,
    51.547,
    51.531,
    51.29,
    51.169,
    51.167,
    50.834,
    50.806,
    50.383,
    49.997,
    49.968,
    49.942,
    49.742,
    49.702,
    49.695,
    49.489,
    49.29,
    49.17,
    49.018,
    48.764,
    48.657,
    48.531,
    48.53,
    48.508,
    48.309,
    47.986,
    47.815,
    47.46,
    47.252,
    47.235,
    47.213,
    47.131,
    46.829,
    46.783,
    46.772,
    46.741,
    46.57,
    46.467,
    46.309,
    46.176,
    45.622,
    45.531,
    45.518,
    44.889,
    44.834,
    44.629,
    44.594,
    44.585,
    43.793,
    42.964,
    42.931,
    42.609,
    42.556,
    42.304,
    42.091,
    41.665,
    41.647,
    41.392,
    41.043,
    40.867,
    40.486,
    40.485,
    39.912,
    39.903,
    39.869,
    39.738,
    39.651,
    39.606,
    39.473,
    39.292,
    38.667,
    38.465,
    38.267,
    38.08,
    36.794,
    36.734,
    36.661,
    36.497,
    36.375,
    36.339,
    36.213,
    36.201,
    35.849,
    34.955,
    34.724,
    34.616,
    34.399,
    33.971,
    33.509,
    33.472,
    33.308,
    33.2,
    32.986,
    32.837,
    32.822,
    32.391,
    32.319,
    31.203,
    31.067,
    30.661,
    30.592,
    30.308,
    30.141,
    28.823,
    28.822,
    28.649,
    28.141,
    28.133,
    27.879,
    27.445,
    27.309,
    27.109,
    26.926,
    26.584,
    26.199,
    26.048,
    25.973,
    25.614,
    25.596,
    25.502,
    25.456,
    25.322,
    25.212,
    25.095,
    24.551,
    24.343,
    24.079,
    23.657,
    23.291,
    22.486,
    22.025,
    20.888,
    19.259,
    19.222,
    18.849,
    18.416,
    18.156,
    17.872,
    17.656,
    17.49,
    17.313,
    17.111,
    15.626,
    15.237,
    13.7,
    12.705,
    12.581,
    12.524,
    12.098,
    11.95,
    11.515,
    9.761,
    8.762,
    8.147,
    8.093,
    7.255,
    7.053,
    5.41,
    3.951,
    3.588,
    3.321,
    3.294,
    2.542,
    2.521,
    2.38,
    2.303,
    1.04,
    1.037,
    -0.077,
    -0.599,
    -1.872,
    -2.404,
    -4.29,
    -7.086,
    -7.453,
    -7.555,
    -7.933,
    -9.054,
    -9.884,
    -11.466,
    -23.591,
    -26.027,
    -27.367,
    -33.609,
    -34.688,
    -45.281,
    -46.251,
    -100.946,
]

const TEST_DATA_FROM_ELASTICSEARCH1 =  [
    6.075896,
    5.990546,
    5.884396,
    5.873577,
    5.848742,
    5.8282146,
    5.790011,
    5.773095,
    5.773095,
    5.7514997,
    5.7190094,
    5.665927,
    5.662723,
    5.6517825,
    5.6365366,
    5.6138215,
    5.6039734,
    5.578368,
    5.562665,
    5.562665,
    5.5544763,
    5.5529957,
    5.5529957,
    5.512433,
    5.512433,
    5.509264,
    5.478245,
    5.443757,
    5.443757,
    5.443757,
    5.414642,
    5.414642,
    5.414642,
    5.414642,
    5.40548,
    5.3816524,
    5.3797894,
    5.3797894,
    5.3401213,
    5.3401213,
    5.3401213,
    5.3401213,
    5.3401213,
    5.3401213,
    5.32026,
    5.32026,
    5.3114142,
    5.2655983,
    5.256261,
    5.256261,
    5.256261,
    5.256261,
    5.256261,
    5.256261,
    5.256261,
    5.256261,
    5.2291117,
    5.2291117,
    5.2291117,
    5.2205667,
    5.2205667,
    5.1966,
    5.1966,
    5.1966,
    5.176298,
    5.176298,
    5.176298,
    5.176298,
    5.141034,
    5.138278,
    5.138278,
    5.138278,
    5.138278,
    5.1327744,
    5.1327744,
    5.0899763,
    5.0899763,
    5.0899763,
    5.0899763,
    5.08125,
    5.08125,
    5.08125,
    5.08125,
    5.08125,
    5.08125,
    5.08125,
    5.08125,
    5.0738077,
    5.055875,
    5.047886,
    5.047886,
    5.006486,
    4.9734907,
    4.9709105,
    4.9709105,
    4.9709105,
    4.9709105,
    4.9709105,
    4.9709105,
    4.9709105,
    4.9709105,
    4.9709105,
    4.9657593,
    4.9657593,
    4.9657593,
    4.9657593,
    4.9657593,
    4.9105477,
    4.886263,
    4.886263,
    4.886263,
    4.886263,
    4.886263,
    4.865261,
    4.865261,
    4.865261,
    4.865261,
    4.865261,
    4.865261,
    4.865261,
    4.832795,
    4.832795,
    4.832795,
    4.8165226,
    4.8092713,
    4.8092713,
    4.8092713,
    4.8092713,
    4.8092713,
    4.8092713,
    4.8092713,
    4.8092713,
    4.8092713,
    4.8092713,
    4.7948346,
    4.7948346,
    4.7948346,
    4.7948346,
    4.7948346,
    4.7948346,
    4.7948346,
    4.7640095,
    4.7640095,
    4.7574663,
    4.7346683,
    4.7346683,
    4.7346683,
    4.7346683,
    4.7346683,
    4.7346683,
    4.7346683,
    4.7346683,
    4.7346683,
    4.7206755,
    4.7206755,
    4.7206755,
    4.6844497,
    4.6844497,
    4.6844497,
    4.6844497,
    4.6844497,
    4.6714354,
    4.6668854,
    4.6668854,
    4.6668854,
    4.6668854,
    4.662345,
    4.662345,
    4.662345,
    4.662345,
    4.662345,
    4.662345,
    4.662345,
    4.662345,
    4.662345,
    4.662345,
    4.662345,
    4.662345,
    4.662345,
    4.662345,
    4.662345,
    4.6487756,
    4.6487756,
    4.6487756,
    4.6487756,
    4.6487756,
    4.6487756,
    4.6487756,
    4.6487756,
    4.613641,
    4.613641,
    4.613641,
    4.5921974,
    4.5921974,
    4.5921974,
    4.5921974,
    4.5921974,
    4.5921974,
    4.5921974,
    4.5921974,
    4.579033,
    4.579033,
    4.579033,
    4.579033,
    4.579033,
    4.579033,
    4.5736427,
    4.5736427,
    4.5449405,
    4.52413,
    4.52413,
    4.52413,
    4.52413,
    4.52413,
    4.52413,
    4.52413,
    4.52413,
    4.52413,
    4.52413,
    4.52413,
    4.52413,
    4.52413,
    4.52413,
    4.4840536,
    4.4840536,
    4.478256,
    4.478256,
    4.478256,
    4.45805,
    4.45805,
    4.45805,
    4.45805,
    4.45805,
    4.45805,
    4.45805,
    4.45805,
    4.45805,
    4.45805,
    4.45805,
    4.45805,
    4.45805,
    4.4456425,
    4.4456425,
    4.4135003,
    4.4135003,
    4.397906,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.393873,
    4.3818192,
    4.3818192,
    4.3818192,
    4.3818192,
    4.3505907,
    4.3198037,
    4.3198037,
    4.3198037,
    4.3150063,
    4.2894487,
    4.2894487,
    4.2894487,
    4.2894487,
    4.2894487,
    4.2709074,
    4.2709074,
    4.2709074,
    4.2709074,
    4.2709074,
    4.2709074,
    4.2709074,
    4.2709074,
    4.2709074,
    4.2709074,
    4.2709074,
    4.2709074,
    4.2709074,
    4.2709074,
    4.2709074,
    4.2709074,
    4.2709074,
    4.2709074,
    4.259518,
    4.259518,
    4.259518,
    4.2300024,
    4.2300024,
    4.2300024,
    4.2282696,
    4.2008924,
    4.2008924,
    4.2008924,
    4.1721807,
    4.1721807,
    4.1721807,
    4.1721807,
    4.1721807,
    4.154637,
    4.154637,
    4.154637,
    4.154637,
    4.154637,
    4.154637,
    4.154637,
    4.154637,
    4.154637,
    4.154637,
    4.154637,
    4.154637,
    4.154637,
    4.154637,
    4.154637,
    4.154637,
    4.154637,
    4.154637,
    4.154637,
    4.143859,
    4.143859,
    4.143859,
    4.088352,
    4.088352,
    4.088352,
    4.088352,
    4.088352,
    4.088352,
    4.088352,
    4.088352,
    4.088352,
    4.088352,
    4.044529,
    4.044529,
    4.044529,
    4.044529,
    4.044529,
    4.044529,
    4.044529,
    4.044529,
    4.044529,
    4.044529,
    4.044529,
    4.034314,
    4.034314,
    4.034314,
    4.034314,
    4.034314,
    4.034314,
    4.034314,
    4.034314,
    4.034314,
    3.9816852,
    3.9816852,
    3.9816852,
    3.9816852,
    3.9816852,
    3.9816852,
    3.9816852,
    3.9816852,
    3.9401069,
    3.9401069,
    3.9401069,
    3.9401069,
    3.9304116,
    3.9304116,
    3.9304116,
    3.9304116,
    3.9304116,
    3.9304116,
    3.9304116,
    3.9304116,
    3.9304116,
    3.9304116,
    3.9055536,
    3.8804421,
    3.8804421,
    3.8804421,
    3.8804421,
    3.8804421,
    3.8804421,
    3.8804421,
    3.8804421,
    3.8804421,
    3.8804421,
    3.8804421,
    3.8409407,
    3.8409407,
    3.8409407,
    3.8409407,
    3.8409407,
    3.8317273,
    3.8317273,
    3.8317273,
    3.8317273,
    3.8317273,
    3.8317273,
    3.8317273,
    3.8317273,
    3.8317273,
    3.7842205,
    3.7842205,
    3.7842205,
    3.7842205,
    3.7842205,
    3.7842205,
    3.7842205,
    3.7842205,
    3.7842205,
    3.7466445,
    3.7466445,
    3.7466445,
    3.7466445,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.7378767,
    3.6568668,
    3.6568668,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.6485138,
    3.571291,
    3.571291,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.563324,
    3.4934444,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4820213,
    3.4116175,
    3.4116175,
    3.4116175,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.4043465,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.330061,
    3.2656112,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.2589488,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.1908097,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.125462,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    3.00248,
    2.8940444,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.8888102,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.783433,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.685473,
    2.594174,
    2.594174,
    2.594174,
    2.594174,
    2.594174,
    2.594174,
    2.594174,
    2.594174,
    2.594174,
    2.594174,
    2.594174,
    2.594174,
    2.594174,
    2.594174,
    2.594174,
    2.594174,
    2.5706096,
    2.5088787,
    2.5088787,
    2.5088787,
    2.5088787,
    2.5088787,
    2.5088787,
    2.5088787,
    2.5088787,
    2.5088787,
    2.5088787,
    2.5088787,
    2.432713,
    2.4290137,
    2.4290137,
    2.4290137,
    2.4290137,
    2.4290137,
    2.4290137,
    2.4290137,
    2.4290137,
    2.4290137,
    2.4290137,
    2.4290137,
    2.3540769,
    2.3540769,
    2.3540769,
    2.3540769,
    2.3540769,
    2.3540769,
    2.3540769,
    2.3540769,
    2.2172675,
    2.2172675,
    2.2172675,
    2.2172675,
    2.2172675,
    2.2172675,
    2.2172675,
    2.2172675,
    2.2172675,
    2.2172675,
    2.2172675,
    2.2172675,
    2.2172675,
    2.0954862,
    2.0954862,
    2.0954862,
    2.0420856,
    1.8880839,
    1.7990532,
    1.71804,
    1.6440091,
    1.6440091,
    1.4558144,
    1.4558144,
    1.3525906,
    1.2630363
]
