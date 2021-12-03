import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import {profiled} from "./ProfiledComponents";

describe("ReactTestingLibraryButton", function() {

    const BasicProfiled = profiled(function Basic() {
        return (
            <div>BasicProfiled</div>
        );
    })

    const Test = () => {
        return (
            <div>
                <BasicProfiled/>
            </div>
        )
    }

    it("Test Profiled Components", async () => {

        render(<Test/>)

        await waitFor(() => screen.getByText("BasicProfiled"))

    });

})
