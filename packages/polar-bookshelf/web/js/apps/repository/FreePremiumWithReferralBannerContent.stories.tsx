import React from 'react';
import {ComponentStory} from "@storybook/react";
import {FreePremiumWithReferralBannerContent} from "./FreePremiumWithReferralBannerContent";
import {StorybookAppRoot} from "../../storybook/StorybookAppRoot";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export default {
    title: 'FreePremiumWithReferralBannerContent',
    component: FreePremiumWithReferralBannerContent,
};

const Template = () => (
    <StorybookAppRoot>
        <FreePremiumWithReferralBannerContent onClose={NULL_FUNCTION}/>
    </StorybookAppRoot>
);

export const Primary: ComponentStory<typeof FreePremiumWithReferralBannerContent> = Template.bind({});
Primary.args = {
};
