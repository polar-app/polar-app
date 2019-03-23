/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Logger} from '../../logger/Logger';
import Button from 'reactstrap/lib/Button';
import {Visibility} from '../../datastore/Datastore';
import Input from 'reactstrap/lib/Input';
import {SocialLinks} from '../../util/SocialLinks';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {PersistenceLayer} from '../../datastore/PersistenceLayer';
import {DatastoreCapabilities} from '../../datastore/Datastore';

const log = Logger.create();

class Styles {

    public static ShareButton: React.CSSProperties = {
        fontSize: '35px',
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: '10px',
    };

    public static ShareImage: React.CSSProperties = {
        maxHeight: '35px',
        maxWidth: '35px',
    };

}

export class ShareContentControl extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.onChanged = this.onChanged.bind(this);
        this.onDone = this.onDone.bind(this);
        this.sharedVia = this.sharedVia.bind(this);

        this.state = {
            // the current visibility or private by default.
            visibility: this.props.visibility || Visibility.PRIVATE
        };

    }

    public render() {

        const visibility = this.state.visibility;

        const createShareLink = () => {

            // FIXME: we need to actually use the backend datastore to get the
            // file here as without it we're dead in the water and we're going
            // to compute the wrong URL.  We need to get the file at the
            // web network layer and with the cloud datastore we're local by
            // default since it's much faster.

            const href = document.location!.href;
            return href.replace(/http:\/\/localhost:8500\//, "https://app.getpolarized.io/");

        };

        const shareLink = createShareLink();

        // FIXME include the tags for the document too this way when people
        // search via Twitter or Facebook these tags show up and so will the
        // docs from Polar when they click through.

        // TODO: include a link back to the main Polar app?

        const VisibilityDescription = () => {

            if (visibility === 'private') {

                return <p>Documents that are <b>private</b> may only be seen or
                    edited by you and are not available to anyone else including
                    search engines.
                </p>;

            } else {
                return <div>

                    <p>
                        Documents that are <b>public</b> are <i>shared publicly
                        on the Internet</i> with anyone who has access to the
                        URL including search engines. Only you can add
                        annotations which appear on this URL. The user may add
                        the document to their own document repository to add
                        their own annotations.
                    </p>

                    <div className="mt-1 mb-1">
                        <b>Link to share:</b>
                    </div>

                    <div className="mb-1">
                        <Input type="text"
                               className="pl-1 pr-1"
                               style={{
                                   minWidth: '150px',
                                   maxWidth: '650px',
                                   fontSize: '14px'
                                }}
                               onFocus={(event) => event.target.select()}
                               defaultValue={shareLink}></Input>
                    </div>

                    <div className="mt-2"
                         style={{
                             display: 'flex'
                         }}>

                        <div className="text-muted mt-auto mb-auto mr-2 ">
                            Share link via:
                        </div>

                        <a target="_new"
                           style={Styles.ShareButton}
                           onClick={() => this.sharedVia('twitter')}
                           title="Twitter"
                           href={SocialLinks.createForTwitter(shareLink)}>

                            <img style={Styles.ShareImage}
                                 alt="twitter"
                                 src="/web/assets/logos/twitter.svg"/>

                        </a>

                        <a target="_new"
                           style={Styles.ShareButton}
                           onClick={() => this.sharedVia('gmail')}
                           title="GMail"
                           href={SocialLinks.createForGMail(shareLink)}>

                            <img style={Styles.ShareImage}
                                 alt="GMail"
                                 src="/web/assets/logos/gmail.svg"/>

                        </a>

                        <a target="_new"
                           style={Styles.ShareButton}
                           onClick={() => this.sharedVia('facebook')}
                           title="Facebook"
                           href={SocialLinks.createForFacebook(shareLink)}>

                            <img style={Styles.ShareImage}
                                 alt="Facebook"
                                 src="/web/assets/logos/facebook.svg"/>

                        </a>

                    </div>

                </div>;
            }

        };

        const outlines = {
            _private: visibility !== Visibility.PRIVATE,
            _public: visibility !== Visibility.PUBLIC,
        };

        return (

            <div>

                <div style={{
                    display: 'flex',
                    verticalAlign: 'top'
                }}>

                    <div className="p-1">

                        <div style={{display: 'block', whiteSpace: 'nowrap'}}
                             className="mt-2 mb-2">

                            <Button id="sharing-button-private"
                                    color="primary"
                                    outline={outlines._private}
                                    size="md"
                                    onClick={() => this.onChanged(Visibility.PRIVATE)}>

                                <span className="mr-1">
                                    <i className="fas fa-lock"></i>
                                </span>

                                Private

                            </Button>

                            <Button id="sharing-button-public"
                                    color="primary"
                                    outline={outlines._public}
                                    size="md"
                                    onClick={() => this.onChanged(Visibility.PUBLIC)}
                                    className="ml-2">

                                <span className="mr-1">
                                    <i className="fas fa-lock-open"></i>
                                </span>

                                Public

                            </Button>

                        </div>

                        <p>
                            This document is currently <b>{visibility}</b>.
                        </p>

                        <VisibilityDescription/>

                        <div className="text-right">

                            <Button id="sharing-button-ok"
                                    color="secondary"
                                    size="sm"
                                    onClick={() => this.onDone()}
                                    className="ml-1">

                                Done

                            </Button>

                        </div>

                    </div>

                </div>

            </div>

        );

    }

    private onChanged(visibility: Visibility) {
        this.setState({visibility});
        this.props.onChanged(visibility);
    }

    private sharedVia(platform: SharePlatform) {
        RendererAnalytics.event({category: 'shared-via', action: platform});
    }

    private onDone() {
        RendererAnalytics.event({category: 'sharing', action: this.state.visibility});
        this.props.onDone();
    }

}

interface IProps {

    readonly datastoreCapabilities: DatastoreCapabilities;

    readonly visibility?: Visibility;

    /**
     * Called when the visibility for this content has chagned.
     */
    readonly onChanged: (visibility: Visibility) => void;

    readonly onDone: () => void;

}

interface IState {
    readonly visibility: Visibility;
}

export type SharePlatform = 'twitter' | 'facebook' | 'gmail';
