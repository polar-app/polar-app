"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFileRequests = void 0;
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Reducers_1 = require("polar-shared/src/util/Reducers");
var AddFileRequests;
(function (AddFileRequests) {
    function fromURL(url) {
        const toBasename = (input) => {
            input = input.replace(/[?#].*$/, '');
            return FilePaths_1.FilePaths.basename(input);
        };
        const parsedURL = new URL(url);
        const basenames = [];
        if (parsedURL.searchParams.get('url')) {
            basenames.push(toBasename(parsedURL.searchParams.get('url')));
        }
        basenames.push(toBasename(url));
        const basename = basenames.filter(current => Preconditions_1.isPresent(current))
            .reduce(Reducers_1.Reducers.FIRST);
        return {
            docPath: url,
            basename
        };
    }
    AddFileRequests.fromURL = fromURL;
    function fromPath(path) {
        return {
            docPath: path,
            basename: FilePaths_1.FilePaths.basename(path)
        };
    }
    AddFileRequests.fromPath = fromPath;
    function computeDirectly(event) {
        if (event.dataTransfer && event.dataTransfer.files) {
            return computeFromFileList(Array.from(event.dataTransfer.files));
        }
        else {
            return [];
        }
    }
    AddFileRequests.computeDirectly = computeDirectly;
    function isFileSupported(name) {
        return FilePaths_1.FilePaths.hasExtension(name, 'pdf') || FilePaths_1.FilePaths.hasExtension(name, 'epub');
    }
    function computeFromFileList(files) {
        function toAddFileRequest(file) {
            if (file.path) {
                return {
                    docPath: file.path,
                    basename: FilePaths_1.FilePaths.basename(file.path)
                };
            }
            else {
                return {
                    docPath: URL.createObjectURL(file),
                    basename: file.name,
                };
            }
        }
        return Array.from(files)
            .filter(file => isFileSupported(file.name))
            .map(toAddFileRequest);
    }
    AddFileRequests.computeFromFileList = computeFromFileList;
    function computeRecursively(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return Optional_1.Optional.empty();
        });
    }
    AddFileRequests.computeRecursively = computeRecursively;
})(AddFileRequests = exports.AddFileRequests || (exports.AddFileRequests = {}));
//# sourceMappingURL=AddFileRequests.js.map