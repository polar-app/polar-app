import {Devices} from "polar-shared/src/util/Devices";

const IS_HANDHELD = ! Devices.isDesktop();

const createHybrid = (pathname: string) => {
    const stripped = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    return `${IS_HANDHELD ? '#' : '/'}${stripped}`;
};

const HOME = "/";
const ANNOTATIONS = "/annotations";
const NOTES = "/notes";
const NOTES_REPO = "/notes/repo";
const NOTE = (id: string) => `${NOTES}/${id}`;
const ANKI_SYNC = "/sync";

const SETTINGS = createHybrid("/settings");
const STATISTICS = createHybrid("/stats");

const WHATS_NEW = createHybrid("/whats-new");
const INVITE = createHybrid("/invite");
const PLANS = createHybrid("/plans");
const PREMIUM = createHybrid("/premium");
const LOGS = createHybrid("/logs");
const DEVICE_INFO = createHybrid("/device");
const FEATURE_REQUESTS = createHybrid("/feature-requests");
const SUPPORT = createHybrid("/support");
const ENABLE_FEATURE_TOGGLE = "/enable-feature-toggle";

const ADD_MOBILE = '/addmobile';
const ACCOUNT = "#account";
const ACCOUNT_MOBILE = "/accountmobile";
const SETTINGS_MOBILE = "/settingsmobile";
const PLAN_MOBILE = "/planmobile";


export const RoutePathNames = {
    HOME,
    ANNOTATIONS,
    NOTES,
    NOTE,
    ADD_MOBILE,
    ANKI_SYNC,
    SETTINGS,
    STATISTICS,
    ACCOUNT_MOBILE,
    ACCOUNT,
    PLAN_MOBILE,
    SETTINGS_MOBILE,
    WHATS_NEW,
    INVITE,
    PLANS,
    PREMIUM,
    LOGS,
    DEVICE_INFO,
    FEATURE_REQUESTS,
    ENABLE_FEATURE_TOGGLE,
    SUPPORT,
    NOTES_REPO,
};
