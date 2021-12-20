// const IS_HANDHELD = ! Devices.isDesktop();

// const createHybrid = (pathname: string) => {
//     const stripped = pathname.startsWith('/') ? pathname.slice(1) : pathname;
//     return `${IS_HANDHELD ? '#' : '/'}${stripped}`;
// };

const HOME = "/";
const ANNOTATIONS = "/annotations";
const DAILY = "/daily";
const NOTES = "/notes";
const NOTE = (id: string) => `/notes/${id}`;
const ANKI_SYNC = "/sync";

const SETTINGS = ("/settings");
const FEATURES = ("/features");
const STATISTICS = ("/stats");

const WHATS_NEW = ("/whats-new");
const INVITE = ("/invite");
const PLANS = ("/plans");
const PREMIUM = ("/premium");
const LOGS = ("/logs");
const DEVICE_INFO = ("/device");
const FEATURE_REQUESTS = ("/feature-requests");
const SUPPORT = ("/support");
const ENABLE_FEATURE_TOGGLE = "/enable-feature-toggle";

const ADD_MOBILE = '/add';
const ACCOUNT = "#account";
const ACCOUNT_MOBILE = "/account";
const SWITCH = "/switch";

export const RoutePathNames = {
    HOME,
    ANNOTATIONS,
    DAILY,
    NOTES,
    NOTE,
    ADD_MOBILE,
    ANKI_SYNC,
    SETTINGS,
    FEATURES,
    STATISTICS,
    ACCOUNT_MOBILE,
    ACCOUNT,
    SWITCH,
    WHATS_NEW,
    INVITE,
    PLANS,
    PREMIUM,
    LOGS,
    DEVICE_INFO,
    FEATURE_REQUESTS,
    ENABLE_FEATURE_TOGGLE,
    SUPPORT,
};
