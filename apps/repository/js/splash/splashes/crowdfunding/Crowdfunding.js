"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Splash_1 = require("../../Splash");
const CrowdfundingCampaign_1 = require("../../../../../../web/js/ui/crowdfunding/CrowdfundingCampaign");
class Crowdfunding extends react_1.default.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const settingKey = 'crowdfunding-campaign-splash';
        return react_1.default.createElement(Splash_1.Splash, { settingKey: settingKey, disableDontShowAgain: true },
            react_1.default.createElement(CrowdfundingCampaign_1.CrowdfundingCampaign, null),
            ";");
    }
}
exports.Crowdfunding = Crowdfunding;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3Jvd2RmdW5kaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQ3Jvd2RmdW5kaW5nLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLGtEQUEwQjtBQUMxQix5Q0FBb0M7QUFDcEMsd0dBQW1HO0FBRW5HLE1BQWEsWUFBYSxTQUFRLGVBQUssQ0FBQyxTQUF5QjtJQUU3RCxZQUFZLEtBQWE7UUFDckIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFFTSxNQUFNO1FBRVQsTUFBTSxVQUFVLEdBQUcsOEJBQThCLENBQUM7UUFFbEQsT0FBTyw4QkFBQyxlQUFNLElBQUMsVUFBVSxFQUFFLFVBQVUsRUFDdEIsb0JBQW9CLEVBQUUsSUFBSTtZQUVyQyw4QkFBQywyQ0FBb0IsT0FBRTtnQkFFbEIsQ0FBQztJQUNkLENBQUM7Q0FFSjtBQWxCRCxvQ0FrQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQgcmVhY3Qvbm8tbXVsdGktY29tcDogMCwgcmVhY3QvcHJvcC10eXBlczogMCAqL1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7U3BsYXNofSBmcm9tICcuLi8uLi9TcGxhc2gnO1xuaW1wb3J0IHtDcm93ZGZ1bmRpbmdDYW1wYWlnbn0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vd2ViL2pzL3VpL2Nyb3dkZnVuZGluZy9Dcm93ZGZ1bmRpbmdDYW1wYWlnbic7XG5cbmV4cG9ydCBjbGFzcyBDcm93ZGZ1bmRpbmcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8SVByb3BzLCBJU3RhdGU+IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBJUHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoKSB7XG5cbiAgICAgICAgY29uc3Qgc2V0dGluZ0tleSA9ICdjcm93ZGZ1bmRpbmctY2FtcGFpZ24tc3BsYXNoJztcblxuICAgICAgICByZXR1cm4gPFNwbGFzaCBzZXR0aW5nS2V5PXtzZXR0aW5nS2V5fVxuICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlRG9udFNob3dBZ2Fpbj17dHJ1ZX0+XG5cbiAgICAgICAgICAgIDxDcm93ZGZ1bmRpbmdDYW1wYWlnbi8+O1xuXG4gICAgICAgIDwvU3BsYXNoPjtcbiAgICB9XG5cbn1cblxuaW50ZXJmYWNlIElQcm9wcyB7XG59XG5cbmludGVyZmFjZSBJU3RhdGUge1xufVxuXG4iXX0=