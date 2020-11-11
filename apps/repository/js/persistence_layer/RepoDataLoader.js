"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepoDataLoader = void 0;
const react_1 = __importDefault(require("react"));
const DataLoader_1 = require("../../../../web/js/ui/data_loader/DataLoader");
const RepoDocMetaLoaders_1 = require("../RepoDocMetaLoaders");
const TagDescriptors_1 = require("polar-shared/src/tags/TagDescriptors");
class RepoDataLoader extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.subscriber = RepoDocMetaManagerSnapshots.create(this.props.repoDocMetaLoader, this.props.repoDocMetaManager);
    }
    render() {
        return (react_1.default.createElement(DataLoader_1.DataLoader, { id: "repoDocMetaLoader", provider: this.subscriber, render: value => this.props.render(value) }));
    }
}
exports.RepoDataLoader = RepoDataLoader;
function createSnapshot(repoDocMetaManager) {
    const docTags = () => TagDescriptors_1.TagDescriptors.filterWithMembers(repoDocMetaManager.repoDocInfoIndex.toTagDescriptors());
    const annotationTags = () => TagDescriptors_1.TagDescriptors.filterWithMembers(repoDocMetaManager.repoDocAnnotationIndex.toTagDescriptors());
    return {
        docTags, annotationTags
    };
}
class RepoDocMetaLoaderSnapshots {
    static create(repoDocMetaLoader) {
        return (onNext, onError) => {
            const releaser = RepoDocMetaLoaders_1.RepoDocMetaLoaders.addThrottlingEventListener(repoDocMetaLoader, () => onNext(true));
            return () => {
                releaser.release();
            };
        };
    }
}
class RepoDocMetaManagerSnapshots {
    static create(repoDocMetaLoader, repoDocMetaManager) {
        return (onNext, onError) => {
            const loaderSnapshotter = RepoDocMetaLoaderSnapshots.create(repoDocMetaLoader);
            const onLoaderNext = () => {
                onNext(createSnapshot(repoDocMetaManager));
            };
            const onLoaderError = onError;
            onNext(createSnapshot(repoDocMetaManager));
            return loaderSnapshotter(onLoaderNext, onLoaderError);
        };
    }
}
//# sourceMappingURL=RepoDataLoader.js.map