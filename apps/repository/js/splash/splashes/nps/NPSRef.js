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
const NPS_1 = require("./NPS");
class NPSRef {
    constructor() {
        this.id = 'nps';
    }
    create() {
        return React.createElement(NPS_1.NPS, null);
    }
    priority(datastoreOverview) {
        return undefined;
    }
}
exports.NPSRef = NPSRef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTlBTUmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiTlBTUmVmLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw2Q0FBK0I7QUFDL0IsK0JBQTBCO0FBSTFCLE1BQWEsTUFBTTtJQUFuQjtRQUVXLE9BQUUsR0FBVyxLQUFLLENBQUM7SUFjOUIsQ0FBQztJQVpVLE1BQU07UUFDVCxPQUFPLG9CQUFDLFNBQUcsT0FBRSxDQUFDO0lBQ2xCLENBQUM7SUFFTSxRQUFRLENBQUMsaUJBQW9DO1FBSWhELE9BQU8sU0FBUyxDQUFDO0lBRXJCLENBQUM7Q0FFSjtBQWhCRCx3QkFnQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge05QU30gZnJvbSAnLi9OUFMnO1xuaW1wb3J0IHtQcmlvcml0aXplZENvbXBvbmVudFJlZn0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vd2ViL2pzL3VpL3ByaW9yaXRpemVkL1ByaW9yaXRpemVkQ29tcG9uZW50TWFuYWdlcic7XG5pbXBvcnQge0RhdGFzdG9yZU92ZXJ2aWV3fSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi93ZWIvanMvZGF0YXN0b3JlL0RhdGFzdG9yZSc7XG5cbmV4cG9ydCBjbGFzcyBOUFNSZWYgaW1wbGVtZW50cyBQcmlvcml0aXplZENvbXBvbmVudFJlZiB7XG5cbiAgICBwdWJsaWMgaWQ6IHN0cmluZyA9ICducHMnO1xuXG4gICAgcHVibGljIGNyZWF0ZSgpOiBKU1guRWxlbWVudCB7XG4gICAgICAgIHJldHVybiA8TlBTLz47XG4gICAgfVxuXG4gICAgcHVibGljIHByaW9yaXR5KGRhdGFzdG9yZU92ZXJ2aWV3OiBEYXRhc3RvcmVPdmVydmlldyk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG5cbiAgICAgICAgLy8gbmVlZCB0byBsb29rIGF0IGJvdGggdGhlIGRheSB0aGUgdXNlciBhZGRlZCBpdCBwbHVzXG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIH1cblxufVxuIl19