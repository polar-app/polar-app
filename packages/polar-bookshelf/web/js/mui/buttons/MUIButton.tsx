import * as React from 'react';

import Button, { ButtonProps } from '@material-ui/core/Button';
import { useLinkLoader } from '../../../../web/js/ui/util/LinkLoaderHook';

interface MUIButtonProps extends ButtonProps{
    readonly href?: string;
    readonly onClick: React.MouseEventHandler;
}
// note that the ButtonProps here needs to be the MUIButtonProps that Button uses
// so that we properly pass all the properties of a button like variant, color,
// etc.
export const MUIButton = React.memo((props: MUIButtonProps) => {
    
    const linkLoader = useLinkLoader();
    
    const {href} = props;

    const handleClick = React.useCallback((event: React.MouseEvent) => {
        if(href){
            if (href.startsWith('http:') || href.startsWith('https:')) {
                linkLoader(href, {focus: true, newWindow: true});
            } else {
                props.onClick(event);
            }
        
            // needed to prevent the default href handling.  The way this works is that the
            // click handler is fired then the default browser behavior for navigating URLs is
            // NOT fired because we prevent it here.
        
            event.preventDefault();
            event.stopPropagation();
        }
        
    }, [linkLoader]);
    
    // NOTE that we're using href here with the component which internally will/should
    // turn the component into an 'a' which means that the browsers standard URL
    // handling including right click and 'open in new tab' will work including the key
    // action command+click which is also 'open in new tab'.  This should NOT fire any
    // event I think and if it does the handleClick above should be able to verify this
    // but we should test.
    
    // NOTE that passing ...props will also pass the href and we're going to override
    // the onClick that the user provides with our version
    return (
        <Button {...props} onClick={(event) => handleClick(event)}>
            {props.children}
        </Button>
    );
    
});