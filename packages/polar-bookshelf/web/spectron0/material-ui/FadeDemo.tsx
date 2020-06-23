import * as React from 'react';
import {useState} from 'react';
import Button from '@material-ui/core/Button';
import Fade from "@material-ui/core/Fade";


export const FadeDemo = () => {

    const [active, setActive] = useState(false)

    return (
        <>
            <Button variant="contained" onClick={() => setActive(! active)}>toggle</Button>

            <Fade timeout={1000} in={active}>
                <div> this is the faded content</div>
            </Fade>
        </>
    );

}
