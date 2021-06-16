import {DatastoreGetFile} from './impl/groups/DatastoreGetFile';
import {MailinglistFunction} from './impl/MailinglistFunction';
import {createStripeWebhookFunction} from './impl/stripe/StripeWebhookFunction';
import {StripeChangePlanFunction} from './impl/stripe/StripeChangePlanFunction';
import {StripeCancelSubscriptionFunction} from './impl/stripe/StripeCancelSubscriptionFunction';
import {GroupProvisionFunction} from './impl/groups/GroupProvisionFunction';
import {GroupJoinFunction} from './impl/groups/GroupJoinFunction';
import {GroupDeleteFunction} from './impl/groups/GroupDeleteFunction';
import {ProfileUpdateFunction} from './impl/groups/ProfileUpdateFunction';
import {GroupDocsAddFunction} from './impl/groups/GroupDocsAddFunction';
import {GroupLeaveFunction} from './impl/groups/GroupLeaveFunction';
import {DocChangeVisibilityFunction} from './impl/groups/DocChangeVisibilityFunction';
import {DatastoreImportFileFunction} from './impl/groups/DatastoreImportFileFunction';
import {ProfileDeleteFunction} from './impl/groups/ProfileDeleteFunction';
import {GroupGetFunction} from './impl/groups/GroupGetFunction';
import {GroupInviteFunction} from './impl/groups/GroupInviteFunction';
import {GroupMemberDeleteFunction} from './impl/groups/GroupMemberDeleteFunctions';
import {GroupDocMetaWriteFunction} from "./impl/groups/GroupDocMetaWriteFunction";
import {Webapp} from "./impl/webapp/Webapp";
import {Sitemap} from "./impl/sitemaps/Sitemap";
import {GroupSitemap} from "./impl/sitemaps/GroupSitemap";
import {SearchFunction} from "./impl/search/SearchFunction";
import {SSRFunction} from "./impl/impl/ssr/SSRFunction";
import {HelloWorldFunction} from "./impl/impl/ssr/HelloWorldFunction";
import {StripeCreateSessionFunction} from "./impl/stripe/StripeCreateSessionFunction";
import {AutoFlashcardFunction} from "./impl/gpt3/AutoFlashcardFunction";
import {StripeCreateCustomerPortalFunction} from "./impl/stripe/StripeCreateCustomerPortalFunction";
import {StripeStudentDiscountVerifyFunction} from "./impl/stripe/StripeStudentDiscountVerifyFunction";
import {StripeStudentDiscountFunction} from "./impl/stripe/StripeStudentDiscountFunction";
import {StartTokenAuthFunction} from "./impl/token_auth/StartTokenAuthFunction";
import {VerifyTokenAuthFunction} from "./impl/token_auth/VerifyTokenAuthentication";
import {CloudFunctionsWarmer} from "./impl/CloudFunctionsWarmer";
import {CreateSnapshotFunction} from "./impl/snapshots/CreateSnapshotFunctions";

// import {DocPreviewFunction} from "./impl/docs/DocPreviewFunctions";
// import {DocPreviewSitemapFunction} from "./impl/sitemaps/DocPreviewSitemapFunction";

exports.hello = HelloWorldFunction;
// exports.docPreviewSitemap = DocPreviewSitemapFunction;
exports.ssr = SSRFunction;
exports.mailinglist = MailinglistFunction;
exports.StripeWebhook = createStripeWebhookFunction('live');
exports.StripeWebhookTest = createStripeWebhookFunction('test');
exports.StripeChangePlan = StripeChangePlanFunction;
exports.StripeCancelSubscription = StripeCancelSubscriptionFunction;
exports.StripeCreateSession = StripeCreateSessionFunction
exports.datastoreGetFile = DatastoreGetFile;
exports.groupProvision = GroupProvisionFunction;
exports.groupJoin = GroupJoinFunction;
exports.groupDelete = GroupDeleteFunction;
exports.groupDocsAdd = GroupDocsAddFunction;
exports.profileUpdate = ProfileUpdateFunction;
exports.profileDelete = ProfileDeleteFunction;
exports.groupLeave = GroupLeaveFunction;
exports.docChangeVisibility = DocChangeVisibilityFunction;
exports.datastoreImportFile = DatastoreImportFileFunction;
exports.groupGet = GroupGetFunction;
exports.groupInvite = GroupInviteFunction;
exports.groupMemberDelete = GroupMemberDeleteFunction;
exports.GroupDocMetaWriteFunction = GroupDocMetaWriteFunction;
exports.webapp = Webapp;
exports.groupSitemap = GroupSitemap;
exports.sitemap = Sitemap;
// exports.docAdd = DocAddFunction;
// exports.docPreview = DocPreviewFunction;
exports.search = SearchFunction;
exports.autoFlashcard = AutoFlashcardFunction
exports.StripeCreateCustomerPortal = StripeCreateCustomerPortalFunction;
exports.StripeStudentDiscountVerifyFunction = StripeStudentDiscountVerifyFunction;
exports.StripeStudentDiscountFunction = StripeStudentDiscountFunction;
exports.StartTokenAuth = StartTokenAuthFunction;
exports.VerifyTokenAuth = VerifyTokenAuthFunction;
exports.CloudFunctionsWarmer = CloudFunctionsWarmer;
exports.CreateSnapshotFunction = CreateSnapshotFunction;
