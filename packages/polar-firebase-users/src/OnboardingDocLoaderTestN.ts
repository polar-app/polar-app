import {OnboardingDocLoader} from "./OnboardingDocLoader";
import assert from "assert";

describe('OnBoardingDocLoader', () => {
    const email = 'testing@getpolarized.io';

    it('Loads default PDF for a user email', async () => {
        const result = await OnboardingDocLoader.load(email);
        assert(result);
    })
})
