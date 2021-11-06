import {assert} from 'chai';
import {YarnLockDependencyAnalyzer} from "./YarnLockDependencyAnalyzer";
import parsePackageName = YarnLockDependencyAnalyzer.parsePackageName;

xdescribe("YarnLockDependencyAnalyzer", function() {

    it("parsePackageName", () => {

        assert.equal(parsePackageName("semver-compare@^1.0.0"), "semver-compare")

        assert.equal(parsePackageName("\"semver@2 || 3 || 4 || 5\", semver@^5.0.1, semver@^5.0.3, semver@^5.5.0, semver@^5.6.0, semver@^5.7.1"), "semver")

    });

})
