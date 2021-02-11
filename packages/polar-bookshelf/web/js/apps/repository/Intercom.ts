/* tslint:disable:no-var-keyword prefer-const */
import * as React from 'react';
import {useUserInfoContext} from "./auth_handler/UserInfoProvider";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";

declare var window: any;

export function useIntercom() {

    const context = useUserInfoContext();

    const userInfo = context?.userInfo;

    if (window.intercomSettings) {
        console.log("FIXME1")
        return;
    }

    if (! userInfo) {
        console.log("FIXME2")
        return;
    }

    console.log("FIXME3")

    window.intercomSettings = {
        app_id: "wk5j7vo0",
        name: userInfo?.displayName || "",
        email: userInfo?.email,
        created_at: Math.floor(ISODateTimeStrings.parse(userInfo.creationTime).getTime() / 1000)
    };

    // FIXME: this just isn't getting inserted here...

    const script = document.createElement('script');
    script.appendChild(document.createTextNode("(function(){var w=window;var ic=w.Intercom;if(typeof ic===\"function\"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/wk5j7vo0';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();\n"))

    document.head.appendChild(script);

}

export const Intercom = () => {
    useIntercom();
    return null;
}
