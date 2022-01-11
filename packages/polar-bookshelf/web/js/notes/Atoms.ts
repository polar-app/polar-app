import {createAtom} from "mobx";

export namespace Atoms {

    let atomSequence = 0;

    export interface IAtomExtended {
        readonly name: string;
        readonly reportObserved: (source: string) => void;

    }

    export function create(className: string, callback: () => void): IAtomExtended {

        const name = `${className}#${atomSequence++}`;
        const atom = createAtom(name, () => callback())

        const reportObserved = (source: string) => {
            atom.reportObserved();
            console.log(`FIXME: reportObserved  ${className}.${source}`, new Error())
        }

        return {name, reportObserved};

    }

}
