import React from 'react'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {ReactTestingLibraryButton} from "./ReactTestingLibraryButton";

describe("ReactTestingLibraryButton", function() {

    it("click button", async () => {

        render(<ReactTestingLibraryButton/>)

        fireEvent.click(screen.getByText('Click Me'))

        await waitFor(() => screen.getByText("The user clicked the button!"))

    });

})
