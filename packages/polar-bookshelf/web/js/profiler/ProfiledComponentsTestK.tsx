import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import {profiled} from "./ProfiledComponents";

describe("ProfiledComponents", function() {

    const BasicProfiledWithReactMemo = profiled(React.memo(function Basic() {
        return (
            <div>BasicProfiledWithReactMemo</div>
        );
    }));

    const BasicProfiled = profiled(function Basic() {
        return (
            <div>BasicProfiled</div>
        );
    })

    const Test = () => {
        return (
            <div>
                <BasicProfiledWithReactMemo/>
                <BasicProfiled/>
            </div>
        )
    }

    it("Test Profiled Components", async () => {

        render(<Test/>)

        await waitFor(() => screen.getByText("BasicProfiled"))
        await waitFor(() => screen.getByText("BasicProfiledWithReactMemo"))

    });

})
