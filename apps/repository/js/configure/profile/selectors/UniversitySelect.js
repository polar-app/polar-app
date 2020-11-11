"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversitySelect = void 0;
const Universities_1 = require("polar-shared/src/util/Universities");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const LIMIT = 250;
const universities = ArrayStreams_1.arrayStream(Universities_1.Universities.get())
    .sort(((a, b) => a.name.localeCompare(b.name)))
    .collect();
function toOption(university) {
    return {
        value: university,
        label: university.name
    };
}
const options = ArrayStreams_1.arrayStream(universities)
    .map(toOption)
    .collect();
function loadOptions(inputValue, callback) {
    callback(Loader.filter(inputValue));
}
class Loader {
    static defaultOptions() {
        return ArrayStreams_1.arrayStream(options)
            .head(LIMIT)
            .collect();
    }
    static filter(inputString) {
        if (!inputString || inputString.trim() === '') {
            this.defaultOptions();
        }
        const predicate = (option) => {
            return Preconditions_1.isPresent(option.label) &&
                option.label.toLowerCase().indexOf(inputString.toLowerCase()) !== -1;
        };
        return ArrayStreams_1.arrayStream(options)
            .filter(predicate)
            .head(LIMIT)
            .collect();
    }
}
exports.UniversitySelect = (props) => {
    return null;
};
//# sourceMappingURL=UniversitySelect.js.map