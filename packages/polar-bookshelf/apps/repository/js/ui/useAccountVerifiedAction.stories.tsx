import React from 'react';
import {ComponentStory} from "@storybook/react";
import IconButton from "@material-ui/core/IconButton";
import {StorybookAppRoot} from "../../../../web/js/storybook/StorybookAppRoot";
import {useAccountVerifiedAction, useAccountVerifiedActionDialogWarning} from "./useAccountVerifiedAction";
import {Billing} from "polar-accounts/src/Billing";
import V2PlanPlus = Billing.V2PlanPlus;

export default {
    title: 'useAccountVerifiedAction',
    component: useAccountVerifiedAction,
};

const Demo = () => {

    const accountVerifiedActionDialogWarning = useAccountVerifiedActionDialogWarning();

    React.useEffect(() => {

        accountVerifiedActionDialogWarning('storage', V2PlanPlus);

    }, [accountVerifiedActionDialogWarning])

    return null;

}

const Template = () => (

    <StorybookAppRoot>
        <IconButton>
            <Demo />
        </IconButton>
    </StorybookAppRoot>

);

export const Primary: ComponentStory<any> = Template.bind({});
Primary.args = {
};
