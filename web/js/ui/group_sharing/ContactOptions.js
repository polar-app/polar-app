"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactOptions = void 0;
class ContactOptions {
    static toContactOptions(contactProfiles) {
        const contactProfilesMapped = contactProfiles.map(current => {
            if (current.profile) {
                const { profile } = current;
                const { contact } = current;
                const createLabel = () => {
                    if (profile.name && profile.handle && contact.email) {
                        return `${profile.name} (${contact.email}) AKA ${profile.handle}`;
                    }
                    if (profile.name && contact.email) {
                        return `${profile.name} (${contact.email})`;
                    }
                    return profile.name || profile.handle || contact.email || "";
                };
                const label = createLabel();
                return {
                    value: current.profile.id,
                    label
                };
            }
            else if (current.contact.email) {
                return {
                    value: current.contact.email,
                    label: current.contact.email
                };
            }
            else {
                console.warn("Broken profile information: ", current);
                return undefined;
            }
        });
        return contactProfilesMapped
            .filter(current => current !== undefined)
            .map(current => current);
    }
    static toUserRefs(options = []) {
        return options.map(current => {
            if (current.value.indexOf("@") !== -1) {
                return {
                    value: current.value,
                    type: 'email'
                };
            }
            return {
                value: current.value,
                type: 'profileID'
            };
        });
    }
}
exports.ContactOptions = ContactOptions;
//# sourceMappingURL=ContactOptions.js.map