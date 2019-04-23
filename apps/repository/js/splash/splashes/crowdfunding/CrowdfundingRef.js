"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const ConditionalPrioritizedComponentRef_1 = require("../ConditionalPrioritizedComponentRef");
const Crowdfunding_1 = require("./Crowdfunding");
const ID = "crowdfunding-campaign-splash";
class CrowdfundingRef extends ConditionalPrioritizedComponentRef_1.ConditionalPrioritizedComponentRef {
    constructor() {
        super(ID, 80, "24h");
        this.id = ID;
    }
    create() {
        return React.createElement(Crowdfunding_1.Crowdfunding, null);
    }
}
exports.CrowdfundingRef = CrowdfundingRef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3Jvd2RmdW5kaW5nUmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQ3Jvd2RmdW5kaW5nUmVmLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw2Q0FBK0I7QUFDL0IsOEZBQXlGO0FBQ3pGLGlEQUE0QztBQUU1QyxNQUFNLEVBQUUsR0FBRyw4QkFBOEIsQ0FBQztBQUUxQyxNQUFhLGVBQWdCLFNBQVEsdUVBQWtDO0lBSW5FO1FBQ0ksS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFIVCxPQUFFLEdBQUcsRUFBRSxDQUFDO0lBSXhCLENBQUM7SUFFTSxNQUFNO1FBQ1QsT0FBTyxvQkFBQywyQkFBWSxPQUFFLENBQUM7SUFDM0IsQ0FBQztDQUVKO0FBWkQsMENBWUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge0NvbmRpdGlvbmFsUHJpb3JpdGl6ZWRDb21wb25lbnRSZWZ9IGZyb20gJy4uL0NvbmRpdGlvbmFsUHJpb3JpdGl6ZWRDb21wb25lbnRSZWYnO1xuaW1wb3J0IHtDcm93ZGZ1bmRpbmd9IGZyb20gJy4vQ3Jvd2RmdW5kaW5nJztcblxuY29uc3QgSUQgPSBcImNyb3dkZnVuZGluZy1jYW1wYWlnbi1zcGxhc2hcIjtcblxuZXhwb3J0IGNsYXNzIENyb3dkZnVuZGluZ1JlZiBleHRlbmRzIENvbmRpdGlvbmFsUHJpb3JpdGl6ZWRDb21wb25lbnRSZWYge1xuXG4gICAgcHVibGljIHJlYWRvbmx5IGlkID0gSUQ7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoSUQsIDgwLCBcIjI0aFwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlKCk6IEpTWC5FbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIDxDcm93ZGZ1bmRpbmcvPjtcbiAgICB9XG5cbn1cbiJdfQ==