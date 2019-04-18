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
const ISODateTimeStrings_1 = require("../../../../../../web/js/metadata/ISODateTimeStrings");
const TimeDurations_1 = require("../../../../../../web/js/util/TimeDurations");
const Prefs_1 = require("../../../../../../web/js/util/prefs/Prefs");
const PRIORITY = 75;
exports.PREF_KEY = 'net-promoter-score';
class NPSRef {
    constructor() {
        this.id = 'nps';
        this.prefs = new Prefs_1.LocalStoragePrefs();
    }
    create() {
        return React.createElement(NPS_1.NPS, null);
    }
    priority(datastoreOverview) {
        if (datastoreOverview.created) {
            const since = ISODateTimeStrings_1.ISODateTimeStrings.parse(datastoreOverview.created);
            if (TimeDurations_1.TimeDurations.hasElapsed(since, '24h')) {
                if (!this.prefs.isMarkedDelayed(exports.PREF_KEY)) {
                    return PRIORITY;
                }
            }
        }
        return undefined;
    }
}
exports.NPSRef = NPSRef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTlBTUmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiTlBTUmVmLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw2Q0FBK0I7QUFDL0IsK0JBQTBCO0FBRzFCLDZGQUF3RjtBQUN4RiwrRUFBMEU7QUFDMUUscUVBQTRFO0FBRTVFLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUVQLFFBQUEsUUFBUSxHQUFHLG9CQUFvQixDQUFDO0FBRTdDLE1BQWEsTUFBTTtJQUFuQjtRQUVXLE9BQUUsR0FBVyxLQUFLLENBQUM7UUFFVCxVQUFLLEdBQUcsSUFBSSx5QkFBaUIsRUFBRSxDQUFDO0lBNEJyRCxDQUFDO0lBMUJVLE1BQU07UUFDVCxPQUFPLG9CQUFDLFNBQUcsT0FBRSxDQUFDO0lBQ2xCLENBQUM7SUFFTSxRQUFRLENBQUMsaUJBQW9DO1FBRWhELElBQUksaUJBQWlCLENBQUMsT0FBTyxFQUFFO1lBRTNCLE1BQU0sS0FBSyxHQUFHLHVDQUFrQixDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVsRSxJQUFJLDZCQUFhLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRTtnQkFFeEMsSUFBSSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLGdCQUFRLENBQUMsRUFBRTtvQkFDeEMsT0FBTyxRQUFRLENBQUM7aUJBQ25CO2FBRUo7U0FFSjtRQUlELE9BQU8sU0FBUyxDQUFDO0lBRXJCLENBQUM7Q0FFSjtBQWhDRCx3QkFnQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge05QU30gZnJvbSAnLi9OUFMnO1xuaW1wb3J0IHtQcmlvcml0aXplZENvbXBvbmVudFJlZn0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vd2ViL2pzL3VpL3ByaW9yaXRpemVkL1ByaW9yaXRpemVkQ29tcG9uZW50TWFuYWdlcic7XG5pbXBvcnQge0RhdGFzdG9yZU92ZXJ2aWV3fSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi93ZWIvanMvZGF0YXN0b3JlL0RhdGFzdG9yZSc7XG5pbXBvcnQge0lTT0RhdGVUaW1lU3RyaW5nc30gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vd2ViL2pzL21ldGFkYXRhL0lTT0RhdGVUaW1lU3RyaW5ncyc7XG5pbXBvcnQge1RpbWVEdXJhdGlvbnN9IGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uL3dlYi9qcy91dGlsL1RpbWVEdXJhdGlvbnMnO1xuaW1wb3J0IHtMb2NhbFN0b3JhZ2VQcmVmc30gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vd2ViL2pzL3V0aWwvcHJlZnMvUHJlZnMnO1xuXG5jb25zdCBQUklPUklUWSA9IDc1O1xuXG5leHBvcnQgY29uc3QgUFJFRl9LRVkgPSAnbmV0LXByb21vdGVyLXNjb3JlJztcblxuZXhwb3J0IGNsYXNzIE5QU1JlZiBpbXBsZW1lbnRzIFByaW9yaXRpemVkQ29tcG9uZW50UmVmIHtcblxuICAgIHB1YmxpYyBpZDogc3RyaW5nID0gJ25wcyc7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IHByZWZzID0gbmV3IExvY2FsU3RvcmFnZVByZWZzKCk7XG5cbiAgICBwdWJsaWMgY3JlYXRlKCk6IEpTWC5FbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIDxOUFMvPjtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJpb3JpdHkoZGF0YXN0b3JlT3ZlcnZpZXc6IERhdGFzdG9yZU92ZXJ2aWV3KTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcblxuICAgICAgICBpZiAoZGF0YXN0b3JlT3ZlcnZpZXcuY3JlYXRlZCkge1xuXG4gICAgICAgICAgICBjb25zdCBzaW5jZSA9IElTT0RhdGVUaW1lU3RyaW5ncy5wYXJzZShkYXRhc3RvcmVPdmVydmlldy5jcmVhdGVkKTtcblxuICAgICAgICAgICAgaWYgKFRpbWVEdXJhdGlvbnMuaGFzRWxhcHNlZChzaW5jZSwgJzI0aCcpKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoISB0aGlzLnByZWZzLmlzTWFya2VkRGVsYXllZChQUkVGX0tFWSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFBSSU9SSVRZO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBuZWVkIHRvIGxvb2sgYXQgYm90aCB0aGUgZGF5IHRoZSB1c2VyIGFkZGVkIGl0IHBsdXNcblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgfVxuXG59XG4iXX0=