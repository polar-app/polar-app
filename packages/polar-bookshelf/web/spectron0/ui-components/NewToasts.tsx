import * as React from 'react';
import {ToastError} from "../../js/ui/toasts/Toasts";

const error = new Error("Some bad stuff happened");

const err = {
    message: error.message,
    stack: error.stack!
};

export const NewToasts = () => (

    <div className="m-5">
        <ToastError type='error'
                    title='This is an error'
                    message='something really bad happened'
                    err={err}/>
    </div>

);
