"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Feedback_1 = require("../../../../../../web/js/ui/feedback/Feedback");
const Toaster_1 = require("../../../../../../web/js/ui/toaster/Toaster");
const NPSRef_1 = require("./NPSRef");
const Prefs_1 = require("../../../../../../web/js/util/prefs/Prefs");
class NPS extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.prefs = new Prefs_1.LocalStoragePrefs();
        this.onRated = this.onRated.bind(this);
    }
    render() {
        return (react_1.default.createElement(Feedback_1.Feedback, { category: 'net-promoter-score', title: 'How likely are you to recommend Polar?', from: "Not likely", to: "Very likely", onRated: () => this.onRated() }));
    }
    onRated() {
        Toaster_1.Toaster.success("Thanks for your feedback!");
        this.prefs.markDelayed(NPSRef_1.PREF_KEY);
    }
}
exports.NPS = NPS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTlBTLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiTlBTLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLGtEQUEwQjtBQUsxQiw0RUFBdUU7QUFDdkUseUVBQW9FO0FBQ3BFLHFDQUFrQztBQUNsQyxxRUFBNEU7QUFFNUUsTUFBYSxHQUFJLFNBQVEsZUFBSyxDQUFDLFNBQXlCO0lBSXBELFlBQVksS0FBYTtRQUNyQixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFIQSxVQUFLLEdBQUcsSUFBSSx5QkFBaUIsRUFBRSxDQUFDO1FBSTdDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVNLE1BQU07UUFFVCxPQUFPLENBRUgsOEJBQUMsbUJBQVEsSUFBQyxRQUFRLEVBQUMsb0JBQW9CLEVBQzdCLEtBQUssRUFBQyx3Q0FBd0MsRUFDOUMsSUFBSSxFQUFDLFlBQVksRUFDakIsRUFBRSxFQUFDLGFBQWEsRUFDaEIsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUU3QyxDQUFDO0lBQ04sQ0FBQztJQUVPLE9BQU87UUFFWCxpQkFBTyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBRzdDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLGlCQUFRLENBQUMsQ0FBQztJQUVyQyxDQUFDO0NBRUo7QUEvQkQsa0JBK0JDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50IHJlYWN0L25vLW11bHRpLWNvbXA6IDAsIHJlYWN0L3Byb3AtdHlwZXM6IDAgKi9cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1NwbGFzaH0gZnJvbSAnLi4vLi4vU3BsYXNoJztcbmltcG9ydCB7U3BsaXRMYXlvdXQsIFNwbGl0TGF5b3V0TGVmdH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vd2ViL2pzL3VpL3NwbGl0X2xheW91dC9TcGxpdExheW91dCc7XG5pbXBvcnQge1NwbGl0TGF5b3V0UmlnaHR9IGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uL3dlYi9qcy91aS9zcGxpdF9sYXlvdXQvU3BsaXRMYXlvdXRSaWdodCc7XG5pbXBvcnQge0NhbGxUb0FjdGlvbkxpbmt9IGZyb20gJy4uL2NvbXBvbmVudHMvQ2FsbFRvQWN0aW9uTGluayc7XG5pbXBvcnQge0ZlZWRiYWNrfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi93ZWIvanMvdWkvZmVlZGJhY2svRmVlZGJhY2snO1xuaW1wb3J0IHtUb2FzdGVyfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi93ZWIvanMvdWkvdG9hc3Rlci9Ub2FzdGVyJztcbmltcG9ydCB7UFJFRl9LRVl9IGZyb20gJy4vTlBTUmVmJztcbmltcG9ydCB7TG9jYWxTdG9yYWdlUHJlZnN9IGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uL3dlYi9qcy91dGlsL3ByZWZzL1ByZWZzJztcblxuZXhwb3J0IGNsYXNzIE5QUyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxJUHJvcHMsIElTdGF0ZT4ge1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSBwcmVmcyA9IG5ldyBMb2NhbFN0b3JhZ2VQcmVmcygpO1xuXG4gICAgY29uc3RydWN0b3IocHJvcHM6IElQcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMub25SYXRlZCA9IHRoaXMub25SYXRlZC5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoKSB7XG5cbiAgICAgICAgcmV0dXJuIChcblxuICAgICAgICAgICAgPEZlZWRiYWNrIGNhdGVnb3J5PSduZXQtcHJvbW90ZXItc2NvcmUnXG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU9J0hvdyBsaWtlbHkgYXJlIHlvdSB0byByZWNvbW1lbmQgUG9sYXI/J1xuICAgICAgICAgICAgICAgICAgICAgIGZyb209XCJOb3QgbGlrZWx5XCJcbiAgICAgICAgICAgICAgICAgICAgICB0bz1cIlZlcnkgbGlrZWx5XCJcbiAgICAgICAgICAgICAgICAgICAgICBvblJhdGVkPXsoKSA9PiB0aGlzLm9uUmF0ZWQoKX0vPlxuXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvblJhdGVkKCkge1xuXG4gICAgICAgIFRvYXN0ZXIuc3VjY2VzcyhcIlRoYW5rcyBmb3IgeW91ciBmZWVkYmFjayFcIik7XG5cbiAgICAgICAgLy8gbWFyayBpdCBkZWxheWVkIHNvIGl0J3Mgbm90IHNob3duIGFnYWluLlxuICAgICAgICB0aGlzLnByZWZzLm1hcmtEZWxheWVkKFBSRUZfS0VZKTtcblxuICAgIH1cblxufVxuXG5pbnRlcmZhY2UgSVByb3BzIHtcbn1cblxuaW50ZXJmYWNlIElTdGF0ZSB7XG59XG5cbiJdfQ==