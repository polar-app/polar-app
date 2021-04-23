import * as React from 'react';
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {GiftSVGIcon} from "../../../../web/js/ui/svg_icons/GiftSVGIcon";
import {SVGIcon} from "../../../../web/js/ui/svg_icons/SVGIcon";
import {EnvelopeIcon} from "../../../../web/js/ui/icons/FixedWidthIcons";
import Button from '@material-ui/core/Button';

class Styles {

    public static icon: React.CSSProperties = {
        fontSize: '120px',
        margin: '20px',
        color: '#007bff'
    };

}


interface IProps {

    onInvitedUserText: (text: string) => void;
    onInvite: () => void;

}

const DesktopMailBody = (props: IProps) => (

    <div>
        <p className="text-muted">
            Enter their emails below and we'll send them an invitation:
        </p>

        <div className="mt-2">
            <textarea autoFocus={true}
                      onChange={(element) =>  props.onInvitedUserText(element.currentTarget.value)}
                      style={{width: '100%', height: '100px'}}>

            </textarea>
        </div>

        <div className="text-center">

            <Button color="primary"
                    size="large"
                    variant="contained"
                    style={{
                        width: '200px'
                    }}
                    onClick={() => props.onInvite()}>

                <EnvelopeIcon/>

                Invite

            </Button>

        </div>

    </div>

);

const MailBody = (props: IProps) =>  (
    <DeviceRouter desktop={<DesktopMailBody {...props}/>}/>
);

const CopyReferralCodeButton = () => (
    // <InputGroup size="lg">
    //     <Input value="https://app.getpolarized.io/ref?id=1234" disabled/>
    //     <InputGroupAddon addonType="append">
    //         <Button color="secondary">Copy</Button>
    //     </InputGroupAddon>
    // </InputGroup>
    <div></div>
);

export const InviteUsersContent = (props: IProps) => (
    <div className="intro p-1">

        <div className="text-center">

            {/*<i className="fas fa-envelope-open" style={Styles.icon}/>*/}

            <div className="m-2">
                <SVGIcon size={150}>
                    <GiftSVGIcon/>
                </SVGIcon>
            </div>

            <h1 className="title">Invite Your Friends to Polar</h1>

        </div>

        <p className="subtitle" style={{}}>
            Get <b>one free month of premium</b> for every friend you invite!
        </p>


        <MailBody {...props}/>

        <div className="text-muted text-bold mt-4 border-top text-center">

            <h3 className="mt-2">
                More ways to invite your friends
            </h3>

        </div>

        <div className="m-4">
            <div style={{width: '500px'}} className="ml-auto mr-auto">
                <CopyReferralCodeButton/>
            </div>
        </div>

    </div>

);
