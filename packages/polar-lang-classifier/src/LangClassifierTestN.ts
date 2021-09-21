import {assert} from 'chai';
import {LangClassifier} from "./LangClassifier";

describe("LangClassifier", function () {
    it("basic", () => {

        const result = LangClassifier.classify("We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.--That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed, --That whenever any Form of Government becomes destructive of these ends, it is the Right of the People to alter or to abolish it, and to institute new Government, laying its foundation on such principles and organizing its powers in such form, as to them shall seem most likely to effect their Safety and Happiness.");

        assert.deepEqual(result[0], {
            "alpha2": "en",
            "alpha3": "eng",
            "language": "English",
            "score": 1
        })

    });
})
