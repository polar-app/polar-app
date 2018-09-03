"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentManager_1 = require("../../components/ComponentManager");
const DefaultContainerProvider_1 = require("../../components/containers/providers/impl/DefaultContainerProvider");
const PagemarkModel_1 = require("../model/PagemarkModel");
const ThumbnailContainerProvider_1 = require("../../components/containers/providers/impl/ThumbnailContainerProvider");
const ProgressView_1 = require("./ProgressView");
const PrimaryPagemarkComponent_1 = require("./components/PrimaryPagemarkComponent");
const ThumbnailPagemarkComponent_1 = require("./components/ThumbnailPagemarkComponent");
exports.PAGEMARK_VIEW_ENABLED = true;
class PagemarkView {
    constructor(model) {
        this.model = model;
        this.primaryPagemarkComponentManager
            = new ComponentManager_1.ComponentManager(model, new DefaultContainerProvider_1.DefaultContainerProvider(), () => new PrimaryPagemarkComponent_1.PrimaryPagemarkComponent(), () => new PagemarkModel_1.PagemarkModel());
        this.thumbnailPagemarkComponentManager
            = new ComponentManager_1.ComponentManager(model, new ThumbnailContainerProvider_1.ThumbnailContainerProvider(), () => new ThumbnailPagemarkComponent_1.ThumbnailPagemarkComponent(), () => new PagemarkModel_1.PagemarkModel());
        this.progressView = new ProgressView_1.ProgressView(this.model);
    }
    start() {
        if (this.primaryPagemarkComponentManager)
            this.primaryPagemarkComponentManager.start();
        if (this.thumbnailPagemarkComponentManager)
            this.thumbnailPagemarkComponentManager.start();
        this.progressView.start();
    }
}
exports.PagemarkView = PagemarkView;
//# sourceMappingURL=PagemarkView.js.map