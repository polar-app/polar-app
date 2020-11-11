"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupSharingRecords = void 0;
const GroupMembers_1 = require("../../datastore/sharing/db/GroupMembers");
const GroupMemberInvitations_1 = require("../../datastore/sharing/db/GroupMemberInvitations");
const Groups_1 = require("../../datastore/sharing/db/Groups");
const Profiles_1 = require("../../datastore/sharing/db/Profiles");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const Promises_1 = require("../../util/Promises");
const Contacts_1 = require("../../datastore/sharing/db/Contacts");
const UserGroups_1 = require("../../datastore/sharing/db/UserGroups");
const Logger_1 = require("polar-shared/src/logger/Logger");
const UserGroupMembership_1 = require("../../datastore/sharing/db/UserGroupMembership");
const log = Logger_1.Logger.create();
class GroupSharingRecords {
    static fetch(groupID, contactsHandler, membersHandler, groupsHandler, errorHandler) {
        let members = [];
        const getGroupMemberInvitations = () => __awaiter(this, void 0, void 0, function* () {
            const profile = yield Profiles_1.Profiles.currentProfile();
            if (!profile) {
                log.warn("No current user profile");
                return [];
            }
            const records = yield GroupMemberInvitations_1.GroupMemberInvitations.listByGroupIDAndProfileID(groupID, profile.id);
            return records.map(current => {
                return {
                    id: current.id,
                    label: current.to,
                    created: current.created,
                    type: 'pending',
                    value: current
                };
            });
        });
        const getGroupMembers = () => __awaiter(this, void 0, void 0, function* () {
            const records = yield GroupMembers_1.GroupMembers.list(groupID);
            const memberRecordInits = records.map(current => {
                return {
                    id: current.id,
                    profileID: current.profileID,
                    label: current.profileID,
                    created: current.created,
                    type: 'member',
                    value: current
                };
            });
            const resolvedProfiles = yield Profiles_1.Profiles.resolve(memberRecordInits);
            return resolvedProfiles.map(current => {
                const [memberRecordInit, profile] = current;
                if (profile) {
                    return Object.assign(Object.assign({}, memberRecordInit), { label: profile.name || profile.handle || "unnamed", image: Optional_1.Optional.of(profile.image).getOrUndefined() });
                }
                else {
                    return memberRecordInit;
                }
            });
        });
        const fireMembersHandler = (newMembers) => {
            members = [...members, ...newMembers].sort((a, b) => a.label.localeCompare(b.label));
            membersHandler(members);
        };
        const doHandleMembership = () => __awaiter(this, void 0, void 0, function* () {
            if (!(yield UserGroups_1.UserGroups.hasPermissionForGroup(groupID))) {
                return;
            }
            const group = yield Groups_1.Groups.get(groupID);
            if (group) {
                const promises = [
                    getGroupMembers(),
                    getGroupMemberInvitations()
                ].map(current => {
                    const handler = () => __awaiter(this, void 0, void 0, function* () {
                        fireMembersHandler(yield current);
                    });
                    return handler();
                });
                Promises_1.Promises.executeInBackground(promises, err => errorHandler(err));
            }
        });
        const doHandleContacts = () => __awaiter(this, void 0, void 0, function* () {
            const contacts = yield Contacts_1.Contacts.list();
            const resolvedProfiles = yield Profiles_1.Profiles.resolve(contacts);
            const contactProfiles = resolvedProfiles.map(current => {
                const [contact, profile] = current;
                return { contact, profile };
            });
            contactsHandler(contactProfiles);
        });
        const doHandleGroups = () => __awaiter(this, void 0, void 0, function* () {
            const groups = yield UserGroupMembership_1.UserGroupMembership.get();
            groupsHandler(groups);
        });
        const doHandle = () => __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                doHandleContacts(),
                doHandleMembership(),
                doHandleGroups()
            ]);
        });
        doHandle()
            .catch(err => errorHandler(err));
    }
}
exports.GroupSharingRecords = GroupSharingRecords;
//# sourceMappingURL=GroupSharingRecords.js.map