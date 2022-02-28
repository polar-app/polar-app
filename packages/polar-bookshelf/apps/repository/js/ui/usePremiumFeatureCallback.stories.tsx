import React from 'react';
import {ComponentStory} from "@storybook/react";
import IconButton from "@material-ui/core/IconButton";
import {usePremiumFeatureCallback, usePremiumFeatureCallbackDialogWarning} from "./usePremiumFeatureCallback";
import {StorybookAppRoot} from "../../../../web/js/storybook/StorybookAppRoot";

export default {
    title: 'usePremiumFeatureCallback',
    component: usePremiumFeatureCallback,
};

const Demo = () => {

    const premiumFeatureCallbackDialogWarning = usePremiumFeatureCallbackDialogWarning();

    React.useEffect(() => {

        premiumFeatureCallbackDialogWarning();

    }, [premiumFeatureCallbackDialogWarning])

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
