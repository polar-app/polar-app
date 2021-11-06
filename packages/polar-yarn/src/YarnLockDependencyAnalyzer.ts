import {HashMultimap} from "polar-shared/src/util/Multimap";
import {TextGrid} from "polar-shared/src/util/TextGrid";

const fs = require('fs');
const lockfile = require('@yarnpkg/lockfile');

export namespace YarnLockDependencyAnalyzer {

    /**
     * "@amplitude/node@=1.8.0
     */
    type PackageNameAndVersion = string;

    type PackageName = string;

    type SemverStr = string;

    interface IYarnDependencyMap {
        [key: string /* PackageName */]: SemverStr;
    }

    interface IYarnLockObjectEntryWithPackageName {
        readonly pkg: PackageName;
        readonly version: SemverStr;
        readonly dependencies?: Readonly<IYarnDependencyMap>;
    }

    interface IYarnLockObjectEntry {
        readonly version: string;
        readonly dependencies?: Readonly<IYarnDependencyMap>;
    }

    interface IUYarnObjectMap {
        [key: string /* PackageNameAndVersion */]: IYarnLockObjectEntry;
    }

    interface IYarnLock {
        readonly type: 'success';
        readonly object: IUYarnObjectMap;
    }

    interface IPackageVersionConflict {
        readonly pkg: PackageName;
        readonly count: number;
    }

    export function parsePackageName(name: string) {

        const m = name.match(/^[@"]?[^@]+/);

        if (m) {

            if (m[0].startsWith("\"")) {
                return m[0].substring(1);
            }

            return m[0]
        }

        throw new Error("Unable to parse package name: " + name)

    }

    export async function analyze() {

        const file = fs.readFileSync('yarn.lock', 'utf8');
        const yarn_lock: IYarnLock = lockfile.parse(file);

        // console.log(JSON.stringify(json, null, '  '));


        /**
         * the parser returns one entry per version even if multiple rules match it.
         */
        function parseEntriesByUniqueVersion() {

            const result = new HashMultimap<string, IYarnLockObjectEntryWithPackageName>()

            for(const entry of Object.entries(yarn_lock.object)) {
                const [entryName, entryMeta] = entry;
                const packageName = parsePackageName(entryName);
                const key = `${packageName}@${entryMeta.version}`;
                result.put(key, {...entryMeta, pkg: packageName})
            }

            return result;

        }

        function parseLockByPackageName(entriesByUniqueVersion: HashMultimap<string, IYarnLockObjectEntryWithPackageName>) {

            const result = new HashMultimap<string, IYarnLockObjectEntryWithPackageName>()

            for(const entry of entriesByUniqueVersion.entries()) {
                const [entryName, entryMeta] = entry;
                const packageName = parsePackageName(entryName);
                result.put(packageName, entryMeta[0])
            }

            return result;

        }

        const entriesByUniqueVersion = parseEntriesByUniqueVersion();
        const entriesByPackageName = parseLockByPackageName(entriesByUniqueVersion);
;

        // TODO: this need to compute the score by:
        //
        // - looking at every entry and recursively finding its dependencies....
        // - finding dependencies that that are conflicting and computing a score
        // - find the most packages that yield (recursively) to the highest scores.

        function computePackagesWithConflicts() {

            return entriesByPackageName.entries()
                .map(current => {
                    const [entryName, entryValue] = current;
                    return <IPackageVersionConflict> {
                        pkg: entryName,
                        count: entryValue.length
                    }
                })
                .filter(current => current.count > 1)
                .sort((a, b) => b.count - a.count)

        }



        const packageWithConflicts = computePackagesWithConflicts()

        // console.log("packageWithConflicts: ", JSON.stringify(packageWithConflicts, null, '  '));

        function createPackageConflictReport() {

            const textGrid = TextGrid.createFromHeaders('name', 'count');
            packageWithConflicts.forEach(current => textGrid.row(current.pkg, current.count));
            console.log(textGrid.format())
            return textGrid.format();

        }



        console.log(createPackageConflictReport())

    }

}

YarnLockDependencyAnalyzer.analyze()
    .catch(err => console.error("Failed to analyze yarn.lock: ", err));
