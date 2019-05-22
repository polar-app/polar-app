import * as React from 'react';
import {Logger} from '../../../../../web/js/logger/Logger';
import {EmbeddedImages} from './EmbeddedImages';
import {CrowdfundingCampaign} from '../../../../../web/js/ui/crowdfunding/CrowdfundingCampaign';

const log = Logger.create();

export class WhatsNewContent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div>

                <div>

                    {/*<div className="intro">*/}
                    {/*    <CrowdfundingCampaign/>*/}
                    {/*</div>*/}


                    <h3>Polar 1.19.0</h3>

                    <div className="intro">

                        <p className="text-center">
                            <iframe className="embed-responsive-item"
                                    width="560"
                                    height="315"
                                    src="https://www.youtube.com/embed/Q5SU31cT4DQ"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen></iframe>
                        </p>

                        <p>
                            Polar 1.19 has been a lot of work but it's finally out the door.

                            There are a few we want to highlight about this release.
                        </p>

                        <b>Area Highlights</b>

                        <p>
                            Area highlights are now shown in the sidebar and
                            updated and resized while you drag the area
                            highlight box.
                        </p>

                        <b>Updated Annotations View</b>

                        <p>
                            We've updated the annotations view to show
                            preview annotations and a better view of each
                            annotation including showing area highlights.
                        </p>

                        <b>Color Selector</b>

                        <p>
                            There's now an advanced color selector for highlights
                            and this expands us to 12 different colors.  We're going
                            to expand the palette in the future but this is already
                            a step in the right directly.
                        </p>

                        <p>
                            Technically we support any RGB value but we're
                            limiting the colors you can select for now just to
                            make the UI simpler and easy to use.
                        </p>

                        <b>Performance Improvements</b>

                        <p>
                            We've also implemented some more major performance
                            improvements when working with larger documents and
                            larger sets of annotations.
                        </p>

                        <b>Native PDF Handling in Web Extension Disabled</b>

                        <p>
                            We've had to remove the native PDF handling in our web extension.
                        </p>

                        <p>
                            This feature automatically previewed and added a
                            PDF to the Polar webapp while browsing.
                        </p>

                        <p>We had to disable it due to cross domain security
                        issues we weren't able to fix. This might be enabled
                        again in a future version of Polar.</p>

                    </div>


                    <h3>Polar 1.18.0</h3>

                    <div className="intro">

                        <p>
                            This release mostly focused on improving stability
                            and implementing a few key UI features.  This
                            upgrades us to Electron 5.x which as needed for
                            some users who were experiencing severe latency
                            using Polar on Linux.  We also resolve a key issue
                            with non-atomic writes.
                        </p>

                        <p>
                            This includes a good chunk of the new sharing
                            functionality but it's not enabled yet.
                        </p>


                    </div>

                    <ul>

                        <li>Big upgrade to latest version of Electron. Electron v5.0.0, Chromium v73.0.3683.119, Node v12.0.0, v8 v7.3.492.27-electron.0. This should hopefully fix a major latency issue some users were seeing on Ubuntu/Linux.

                        </li><li>Major performance fix on large PDFs.  Scrolling should be dramatically improved.  There's still a small latency issue we're seeing but already performance is dramatically improved.

                        </li><li>Enabled atomic writes again for all platforms.

                        </li><li>Filtering for tags now lists the tags alphabetically

                        </li><li>Right click on text highlight now add 'scroll into view'

                        </li><li>Upgraded to latest version of Typescript 3.4.3

                        </li><li>Fixed regression where progress wasn't being updated when progress messages were being sent from the renderer process.

                        </li><li>Fixed bug which resorted in two file uploads to firebase while cloud sync was operational. For large files this was very painful and resorted in 2x data being uploaded.

                        </li><li>Fixed bug where the UI would break when both filtering and removing tags on a document that was visible.

                        </li>
                        <li>Increased the sidebar a bit to accommodate updating comments without overflow of the summernote bar.

                        </li>
                        <li>Using the same account widget on web + desktop now.</li>

                    </ul>

                    <h3>Polar 1.17.14</h3>

                    <div className="intro">

                        <p>
                            This release mostly focused on our Crowdfunding campaign but the full
                            changelog from 1.16.0 is below.  We're actively working on 1.18.0 which
                            will include a number of really exciting features to stay tuned!
                        </p>

                    </div>
                    <ul>

                        <li>
                            <p>Significant refactor to allow us to use direct URLs which we can calculate
                                instead of having to use Firebase metadata + URL calculation which was very
                                slow and latent.  Sometimes up to 7500ms for fetching metadata.  Now requests
                                here are consistently 200ms and sometimes 0ms if we're fairly certain the URL
                                exists (when the client is fully sync'd).</p>
                        </li>
                        <li>
                            <p>Fixed bug where iframes would not load within capture occasionally.</p>
                        </li>
                        <li>
                            <p>New support for attachments in DocInfo and the ability for attachments to
                                just be a bucket + file ref...</p>
                        </li>
                        <li>
                            <p>No longer waiting for remote writes for large files.</p>
                        </li>
                        <li>
                            <p>Fixed bad bug with blob conversion that only hit us sometimes.</p>
                        </li>
                        <li>
                            <p>Added survey to the new NPS form too.</p>
                        </li>
                        <li>
                            <p>Integrated the net promoter score to prompt once per week so we get more NPS
                                data points.</p>
                        </li>
                        <li>
                            <p>Fixed blob streams when replicating from the cloud back to disk.</p>
                        </li>
                        <li>
                            <p>Webapp now supports range queries for fetching PDFs rather than fetching the
                                entire document.  MASSIVE performance improvement here.</p>
                        </li>
                        <li>
                            <p>Migrated to workbox as sw-precache was officially deprecated.</p>
                        </li>
                        <li>
                            <p>Fixed ugly bug with async providers reading the value before it was awaited</p>
                        </li>
                        <li>
                            <p>Fixed bugs with the disk store not properly handling deletions of .meta files</p>
                        </li>
                        <li>
                            <p>Fixed bugs with delete when the cloud store was running not properly showing
                                that deletes were performed.</p>
                        </li>
                        <li>
                            <p>Fixed bad bug where deletes were replicated and attempted to be read</p>
                        </li>
                        <li>
                            <p>New fix where a notice is given to the user that a delete was successful.</p>
                        </li>

                    </ul>

                    <h3>Polar 1.16.0</h3>

                    <div className="intro">

                        <p>A number of major changes went into Polar 1.16.0 but
                            the big highlights include a big performance bump
                            for the desktop app on startup, an updated
                            chrome extension to improve stability during
                            loading PDFs, and a new context menu for the
                            document repository.</p>

                        <p>
                            This also includes a new timing system which allows
                            us to detect slow operations in Polar to help improve
                            performance over time.  The plan is to keep an
                            eye on these metrics to help track down any performance
                            regressions and also to improve performance over time.
                        </p>

                    </div>

                    <ul>
                        <li>
                            <p>Multi-delete button now uses the confirm prompt properly.</p>
                        </li>
                        <li>
                            <p>The doc repo now supports a context menu for each row</p>
                        </li>
                        <li>
                            <p>Fixed major performance issue with the datastore on Electron as it was going
                                through the IPC process for the datastore data reads and this was amazingly
                                slow. Moving it into the renderer process speeds up reads by about 10x.</p>
                        </li>
                        <li>
                            <p>Fixed bad bug in the webapp where we wouldn't ever fetch the latest docs from
                                firebase.</p>
                        </li>
                        <li>
                            <p>A ton of improvement to tooltips needed for mobile support but also the fact
                                that having them popup bothered a lot of users.</p>
                        </li>
                        <li>
                            <p>Inline app message that styling with rich HTML is supported for new users.</p>
                        </li>
                        <li>
                            <p>More improvements for mobile.</p>
                        </li>
                        <li>
                            <p>Fixed bag bug where Firebase batches weren't used properly and we had a
                                delete outside of the batch which could leave FB inconsistent.</p>
                        </li>
                        <li>
                            <p>Always show the multi-delete and multi-tag buttons even if just one is
                                selected as it will still work just fine.</p>
                        </li>
                        <li>
                            <p>Make the top buttons for tagging and delete permanently displayed not hidden.</p>
                        </li>
                        <li>
                            <p>Added a couple key metrics for Firebase performance via tracer so that we can
                                verify real-world behavior.</p>
                        </li>
                        <li>
                            <p>RendererAnalytics now safer if accidentally called from the Node context and
                                just silently fails.</p>
                        </li>
                        <li>
                            <p>RendererAnalytics now supports using a stopwatch so we can track the times
                                of important operations.</p>
                        </li>
                        <li>
                            <p>Improved CSS of annotation sidebar and included instructions on how to create
                                your first annotation.</p>
                        </li>
                        <li>
                            <p>Use the sidebar area to explain how to create annotations.</p>
                        </li>
                    </ul>

                </div>


                <div>

                    <h3>Polar 1.15.0</h3>

                    <div className="intro">
                        <p>
                            Polar 1.15.0 is a big release for us.  We're calling
                            the webapp production ready at this point but also
                            we've shipped an updated version of the Chrome
                            Extension which supports automatic preview of PDFs
                            and easily saves them to Polar.
                        </p>

                        <p>
                            We will discuss this more in the coming days and
                            weeks as more functionality comes online but we're
                            releasing the initial versions now so we can get
                            feedback.
                        </p>

                    </div>

                </div>


                <div>

                    <h3>Polar 1.13.12</h3>

                    <div className="intro">
                        <p>
                            This release moves us farther towards improving
                            usability as well as having a production web version
                            of Polar.
                        </p>

                        <p>
                            A big new feature here is automatic-resume of your
                            reading from the last pagemark position.
                        </p>

                    </div>

                    <ul>
                        <li>
                            <p>new auto-resume of reading which is now enabled by default.</p>
                        </li>
                        <li>
                            <p>new prefs system for disk datastore and cloud and defaults to localstorage in
                                the browser.</p>
                        </li>
                        <li>
                            <p>We no longer show background progress updates that complete very quickly.
                                This was often distracting when the app was working in the background.</p>
                        </li>
                        <li>
                            <p>Fixed bug with PDF scroll into view where we wouldn't properly scroll to the
                                proper position. Now we just scroll to the page that was last pagemarked.</p>
                        </li>
                        <li>
                            <p>We had the wrong link to the documentation.</p>
                        </li>
                        <li>
                            <p>Update to Electron 3.1.6</p>
                        </li>
                        <li>
                            <p>New AuthHandler system so that we can show user account information when
                                using Firebase auth.</p>
                        </li>
                        <li>
                            <p>Cut down memory usage of the webapp from 1GB to about 200MB.  The gmail app
                                is about 120MB so this isn't far off from being 'reasonable' in terms of
                                memory usage.</p>
                        </li>
                        <li>
                            <p>Upgraded to latest versions of Firebase and Webpack</p>
                        </li>
                    </ul>
                </div>

                <div>

                    <h3>Polar 1.13.11</h3>

                    <div className="intro">
                        <p>
                        This is a small release from perspective of desktop
                        users but this also adds support for the new web app
                        which is actually live now but I'm not yet ready to
                        give out the URL just yet.
                        </p>

                        <p>
                            The biggest change is that you can now create
                            highlights through pagemarks without them
                            interfering in your workflow.  Only the corners
                            are resizable now but other than that you can
                            work directly with the document.
                        </p>

                    </div>

                    <ul>
                        <li>Fixed bugs with multi-select not being able to
                        properly pick the right tags or create tags</li>

                        <li>Update to Electron 3.1.5</li>

                        <li>Pagemarks now allow you to work through them and
                        still can highlight and create + delete annotations now
                        without the pagemarks getting in the way.</li>

                        <li>A number of changes needed to get the webapp version
                        of Polar to work.</li>

                    </ul>

                </div>

                <div>

                    <h3>Polar 1.13.9</h3>

                    <div className="intro">

                        <p>
                            Lots of polish in the 1.13.x series of releases.
                            Enable support for a new user tour during onboarding
                            and a great deal of bug fixes and usability
                            enhancements.
                        </p>

                        <ul>

                            <li>Drag and drop of whole directories works now... Including a UI showing the files being imported.  I need to include a timeout though.</li>
                            <li>A number of changes needed for the webapp are now merged into master.</li>
                            <li>Blackout when dragging files onto polar and drag to import now works.</li>
                            <li>Fixed escape so the filtered tag input goes away.</li>
                            <li>Fixed bugs with deleting items when they were not selected.</li>
                            <li>added metrics for anki sync and the nr of successful and failed tasks.</li>
                            <li>Track screen resolution size and platform name properly</li>
                            <li>Only show splashes when the user is online</li>
                            <li>Upgrade to latest reactstrap and bootstrap versions.</li>

                        </ul>

                        <h4>1.13.8</h4>

                        <ul>
                            <li>Should be the right amount of splashes now.</li>
                            <li>Analytics for the add content button. Not sure if people are capturing pages or not.</li>
                            <li>I inverted the splash time cutoff in this previous previous release and it should be fixed now.</li>
                            <li>Auto app update implemented for MacOS and Windows.  There is a random delay of 3 days to prevent breaking clients in the wild.</li>
                            <li>Don't rely on GA to determine the OS.  Record it ourselves.</li>
                            <li>Enabling auto-updates in this release to keep everyone on the latest so I can iterate faster.</li>
                        </ul>

                        <h4>1.13.7</h4>

                        <ul>
                            <li>quick release to disable another GA feature which could be breaking our analytics</li>
                            <li>Fixed Premium splash layout on smaller screens...</li>
                        </ul>

                        <h4>1.13.6</h4>

                        <ul>
                            <li>Splash messages should be delivered to users at the right times now.</li>
                            <li>I think I fixed a bug with tracking not working due to including 'app version' in the analytics data.</li>
                        </ul>

                        <h4>1.13.5</h4>

                        <ul>
                            <li>multi-delete button for bulk deleting documents</li>
                            <li>buttons in the doc repo are a bit bigger for better hit targets</li>
                            <li>multi-column selection by checkbox now to make it a bit more obvious for users to select multiple documents</li>
                            <li>Clicking flagged or archived buttons no longer select the row which was confusing.</li>
                        </ul>

                        <h4>1.13.4</h4>

                        <ul>
                            <li>Preview release DID NOT load the example docs (BAD BUG)</li>
                            <li>Now targeting header in the tour to avoid scroll.</li>
                        </ul>

                        <h4>1.13.3</h4>

                        <ul>
                            <li>New tour feedback and the end of the tour.</li>
                            <li>Only load example docs once.</li>
                            <li>GA events for cloud login and configured</li>
                            <li>User-Agent was not being properly tracked and this as very important to detect which Operating Systems were being used.</li>
                            <li>Fixed problem with constraining the window sizes on smaller displays like smaller laptops.</li>
                            <li>Sidebar now visible by default and the setting remembered with a local pref.</li>
                            <li>Fixed messenger and F10 and other commands that were accidentally broken in this release.</li>
                        </ul>

                    </div>

                    <h3>Polar 1.12</h3>

                    <div className="intro">

                        <h4>Changelog:</h4>

                        <p>
                            This release focuses mostly on improving the reading
                            management capabilities in Polar.  We now support
                            pagemark modes and can change the colors of the
                            pagemark based on the mode.  Additionally, we have
                            statistics for tracking the number of pages you read
                            per day and an integrated calendar chart showing
                            this visually in the stats page.
                        </p>

                    </div>

                </div>


                <div>

                    <h3>Polar 1.11</h3>

                    <div className="intro">

                        <h4>Changelog:</h4>

                        <p>
                            Version 1.11 has fewer features than our normal weekly
                            releases. The next release will take a bit longer and we
                            wanted to get a version released sooner rather than
                            later.
                        </p>

                        <ul>

                            <li>Feature: More consistent header bar throughout the app.
                            </li>

                            <li>Feature: Pagemark batches which help working with
                                PDFs that have multiple pages.  Now if you create
                                pagemarks across pages you can delete one and the whole
                                batch is also deleted.
                            </li>

                            <li>
                                Feature: Page number in markdown export
                            </li>

                            <li>
                                Feature: Disabled the top message boxes.  They were
                                annoying and only a stop gap until we have a proper
                                onboarding mechanism.
                            </li>

                            <li> Bug: Fixed bug with page zoom not working properly
                                in the HTML viewer.  The zoom now works but pagemarks
                                still aren't placed properly. </li>

                            <li>
                                Upgrade: Electron 3.1.2
                            </li>

                            <li> Donate and Discord buttons in header.  These are
                                important. </li>

                            <li>
                                Feature: Setting POLAR_DISABLE_HARDWARE_ACCELERATION
                                should disable hardwawre acceleration now if that's
                                causing a problem for you.
                            </li>

                        </ul>

                    </div>

                </div>

                <h3>Polar 1.10</h3>

                <div className="intro">

                    <p className="text-center">
                    <iframe width="560" height="315"
                            src="https://www.youtube.com/embed/Q5SU31cT4DQ"
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen></iframe>
                    </p>

                    <p>
                        The 1.10 release again focused on a number of medium-scale
                        features but also improves stability across the board.
                    </p>

                    <h4>Updated UI</h4>

                    <p>
                        The most obvious feature is that the UI has been
                        significantly updated to support a new fixed header
                        bar.
                    </p>

                    <p>
                        One of the motivations for this was that users were
                        getting confused when using the app for the first time
                        and didn't know how to add content.  Now there's a
                        large '+ Add' button front and center which is a clear
                        call to action.
                    </p>

                    <p>
                        Additionally, the added space allows for selecting multiple
                        items.
                    </p>

                    <h4>Tagging Multiple Items</h4>

                    <p>
                        You can now tag multiple items in the UI by holding
                        down shift (or control) and then clicking on the items
                        you want to modify.
                    </p>

                    <p>
                        Shift allows you to select a range and control allows
                        you to select one at a time.
                    </p>

                    <p>
                        At the top left a new 'tag' button will pop up and you
                        can then assign tags to multiple documents at once.
                        This is very handy for new users that want to bulk-tag
                        multiple documents.
                    </p>

                    <p>
                        Additionally, you can now sort by tags and if you hit the
                        'tags' column header at the top, twice, you can see
                        untagged documents and then tag them in bulk.
                    </p>

                    <p>
                        This can be used when importing a large number of documents
                        at once that all have the same tags.
                    </p>

                    <h4>New Exporter Framework</h4>

                    <p>
                        Many users requested the ability to easily export
                        annotations from Polar and we've shipped an initial
                        implementation of exporting content.
                    </p>

                    <p>
                        Note that you have always had the ability to export the
                        raw content in JSON form but this is designed to make
                        exports more usable.
                    </p>

                    <p>
                        In the annotation sidebar there's a new button for
                        'Export' which allows you to write the annotations to
                        JSON or Markdown.
                    </p>

                    <p>
                        Right now it only supports writing to a file but we're
                        also going to implement support for writing to the
                        clipboard as HTML format for easily posting your
                        annotations to your blog, Twitter, etc.
                    </p>

                    <p>
                        The plan is to enable exporting in the 'annotation'
                        view which would allow you to export all your annotations
                        based any filters you define.  This would allow you
                        to preview the annotations and then export them in bulk
                        without having to open up a specific document.
                    </p>

                    <h4>Changelog:</h4>

                    <ul>

                        <li>
                        Feature: Migrated to fixed nav header
                        </li>

                        <li>
                       Feature: GDPR notice in place.
                        </li>

                        <li>
                        Feature: Shift selects a range of documents, control selects one document at a
                        time for multiple documents at once.
                        </li>

                        <li>
                       Feature: Implemented a basic exporter framework.  Annotations can now be
                        exported from the sidebar.  Exporting will be improved over time with more
                        features.
                        </li>

                        <li>
                       Bug: Fixed (I hope) long standing ugly bug of 'crash' of Electron on app exit due
                        to windows not being destroyed via destroy().  Close does not release the
                        resources properly.
                        </li>

                        <li>
                       Bug: Fixed bug where long titles in URLs could generate filenames that were too
                        long and couldn't be represented on the filesystem.  We not truncate at 50
                        chars.
                        </li>

                        <li>
                       Feature: New buttons for '+ Add' to import from disk or capture web page.
                        Much easier to determine how to add content to polar.
                        </li>

                        <li>
                       Feature: multi-select and ability to tag multiple docs at once.
                        </li>

                        <li>
                       Feature: Sorting by tags is now much better and actually works.  If you double
                        click the sort column it will show you untagged documents sorted by the time
                        they were added.
                        </li>

                        <li>
                       Dependencies: Update to electron 3.1.1
                        </li>

                        <li>
                        Bug: Fixed bug where hitting Enter when working with a title would cause the
                        page to reload.
                        </li>


                    </ul>

                </div>

                <h3>Polar 1.9</h3>


                <div className="intro">

                    <p>
                        Polar 1.9.0 was just released. This release is mostly focused around stability and fixes a number of important bugs.
                    </p>

                    <p>
                        One big new feature went into this release though - you’re now able create pagemarks across multiple pages.
                    </p>

                    <p>Here’s the excerpt from the documentation:</p>

                    <p>When you right click and select “Create Pagemark to Point” Polar creates
                        pagemarks over all previous pages up until the previous pagemark (or the
                        beginning) of the document.</p>

                    <p>This enables you to import a book which you’ve been reading and mark multiple
                        pages as read so that you can now just use Polar to track your pgoress.</p>

                    <p>For example, if you have a 300 page book, and you’ve read pages 1-200 you can
                        just jump to page 200 and “Create Pagemark to Point” and pagemarks will be
                        created across all previous pages.</p>

                    <p>You can still pagemark the current page by selecting “Create Pagemark Box” to
                        or run “Control Alt N” to mark just the current page.</p>

                    <h4>Changelog:</h4>

                    <ul>

                        <li>
                            <p>Create pagemark to point now works across multiple pages and ranges.</p>
                        </li>
                        <li>
                            <p>Fixed bad bug where the UI wouldn’t update when a newly imported PDF wasn’t
                                immediately visible in the UI. This was a bad initial user experience as they
                                would have to reload for the PDFs to be visible.</p>
                        </li>
                        <li>
                            <p>Fixed major Twitter content capture bug where we weren’t saving the CSS styles
                                of HTML content.</p>
                        </li>
                        <li>
                            <p>Fixed bug where VH rules that were less than 100 weren’t being set properly
                                and some pages rendered ugly.</p>
                        </li>
                        <li>
                            <p>Fixed bug with the ‘deck:’ tag not properly working with Anki sync.</p>
                        </li>
                        <li>
                            <p>Importing large numbers of PDFs (and large PDFs) is now a lot faster and more
                                responsive when using cloud storage.  In the past we used to wait until the
                                cloud layer was finished but this takes a long time to complete.</p>
                        </li>
                        <li>
                            <p>Now using ‘localhost’ instead of ‘localapp.getpolarized.io’ for the hostname.
                                Some users weren’t able to resolve this (not sure why) and additionally
                                working offline didn’t function either.</p>
                        </li>
                    </ul>

                </div>

                <h3>Polar 1.8</h3>

                <div className="intro">

                    <p>
                        This release concentrated on a number of smaller features
                        requested by users plus fit and finish.  The major changes
                        include refactoring the text editor so that it's more
                        clear that it supports rich text and formatted HTML.
                        We also now support cloze deletions for Anki which was
                        a big feature for a lot of users but required a big
                        refactor.  Additionally we have a new logs view so that
                        you can monitor the internal behavior of Polar during
                        sync (and other) operations.  You can also copy the entire
                        log to the clipboard for reporting bugs to the Polar
                        developers.

                    </p>

                    <h4>Changelog:</h4>

                    <ul>

                        <li>PDFs auto-import when trying to share them from the browser.</li>

                        <li>Refactored the rich text editor so the bar at the top is no longer in 'air'
                        mode so that users can realize that it supports rich text.</li>

                        <li>Support for cloze deletion</li>

                        <li>Stats view for core stats</li>

                        <li>New logs view to show logs as they're being written which can help users
                        debug issues with Polar and report problems to the dev team plus understand
                        what's happening with their data.</li>

                        <li>Related tags in the tag selector</li>

                        <li>'capturing' a PDF from the browser now works and the PDF is then saved into
                        the repository.</li>

                        <li>Copy URL to clipboard shows toaster that the URL was copied successfully.</li>

                        <li>Reveal file in finder (or Explorer on Windows).</li>

                        <li>Copy file path to clipboard.</li>

                    </ul>

                </div>

                <h3>Polar 1.7 - Annotation Manager</h3>

                <div className="intro">

                    <p>
                        This release focuses on two major new features - a
                        sidebar and also a an annotation view to allow users
                        to view the annotations they've made on documents.
                    </p>

                    <p className="text-center">
                        <iframe width="560" height="315"
                                src="https://www.youtube.com/embed/oGk9Skaa6Q0"
                                frameBorder="0"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen></iframe>
                    </p>

                    <h4>Changelog:</h4>

                    <ul>

                        <li> New annotations view to see all your annotations in one place.</li>

                        <li> New sidebar to expand contract to show other pages within polar</li>

                        <li>  New option to create a pagemark at the mouse point.  Still more work to make
                            the key bindings visible.</li>

                        <li>  Adding forced CSS for ::selection so that sites that have broken CSS for
                        highlighting don't actually break polar and we also have consistent highlight
                            support.</li>

                        <li>  Fixed some navigational issues in the web capture system.</li>

                        <li>  Fixed bug the annotation bar in PDF where resize will kill it.  Hopefully the
                            last bug there.</li>

                        <li>  Backend changes to support cloze deletions in Anki.</li>

                    </ul>

                </div>

                <h3>Polar 1.6 - Polar Needs Your Help!</h3>

                <div className="intro">

                    <p>
                        This release focuses on stability but adds a few new
                        features.
                    </p>

                    <p>
                        The biggest changes in this release include
                        a <b>major</b> performance improvement on Windows as well
                        as a <i>new annotation bar</i> that should be both
                        faster and much more reliable (especially with PDFs).
                    </p>

                    <h4>
                        Polar Needs Your Help!
                    </h4>

                    <p>
                        I'd like you to <i>please do me a favor</i> and just take
                        two minutes and see if you can help out Polar.
                    </p>

                    <p>
                        <i className="fas fa-envelope-open text-success"></i>&nbsp;

                        <b>Email 5 colleagues about Polar! </b> Can you take 1 minute
                        and send an email to 5 of your colleagues about Polar and
                        explain (in your own words) why you like it?

                    </p>

                    <p>

                        <i className="fas fa-link text-success"></i>&nbsp;

                        <b>Blog and Link to Polar! </b> If you have a blog
                        or a website could you take 5 minutes and write up a
                        blog post about Polar?  Post to your favorite forum?

                        We have to get the word out and your help is really
                        vital here.

                        Even just a link at the bottom of your website would be
                        a massive help!

                    </p>

                    <p>
                        <i className="fas fa-donate text-success"></i>&nbsp;

                        <b>Can you make a donation to Polar? </b>
                        We have an <a
                        href="https://opencollective.com/polar-bookshelf/donate">Open
                        Collective</a> setup to accept donations.  If you use
                        Polar at work ask your employer if they can make a donation.
                        Many larger employers will both match donations and support
                        projects that help their employees.
                    </p>

                    <p className="text-center">
                        <a href="https://opencollective.com/polar-bookshelf/donate" target="_blank">
                            <img src="https://opencollective.com/polar-bookshelf/donate/button@2x.png?color=blue" width="300" />
                        </a>
                    </p>

                    <p>
                        <i className="fas fa-cloud text-success"></i>&nbsp;

                        <b>Please use cloud sync!</b> If you haven't setup cloud
                        sync yet we'd appreciate your feedback.  Cloud sync is
                        going to be used for Polar document collaboration and we
                        need more people to test it and provide feedback.

                    </p>

                    <h4>Changelog:</h4>

                    <ul>

                        <li>Fixed possible regression due to using SVG icons as these broke the app repo and possibly a few other issue.</li>

                        <li>Re-add uncaught exception handlers on app exit.  Hope to fix the issues we were having with exceptions on app exit.</li>

                        <li>Completely new annotation bar for highlighting which should fix a major bug with the PDF mode.</li>

                        <li>Fixed some fonts + css with the sidebar.</li>

                        <li>Improved indeterminate progress bar on MacOS and just better in general</li>

                        <li>Print the version numbers for updates.</li>

                        <li>Fixed quote mangling due to improper UTF-8 handling.</li>

                        <li>Hopefully fixed high CPU bug on Windows caused by shutdown and attempting to double-close windows.</li>

                        <li>Implemented Control+Enter for creating comments.</li>

                        <li>Making tags + updated + added columns visible by default for new users. I think some people did not discover it by default.</li>

                    </ul>


                </div>


                <h3>Polar 1.5 - Cloud Sync</h3>

                {/*<p className="text-muted">Dec 12, 2018</p>*/}

                <div className="intro">

                    <div className="text-center">
                        <i className="fas fa-cloud-upload-alt"
                           style={{ fontSize: '120px', margin: '20px', color: '#007bff'}}></i>

                        <h1 className="title">Polar Cloud Sync</h1>

                        <p className="subtitle">
                            Polar now supports cloud sync powered by Firebase.
                        </p>

                    </div>

                    <p>
                        Cloud sync is real-time - as soon as you make a change to a
                        local document it is immediately synchronized to the
                        cloud and then to the other computers you have which run
                        Polar.
                    </p>

                    <p>Cloud sync is free for smaller instances and <b>$7.99</b> for
                        users with more than 100 documents.
                    </p>

                    <p>
                        To ensure data safety we now support local lightweight
                        backups of your data. We take backups at critical points
                        including just before you synchronize for the first
                        time.
                    </p>

                </div>

                <h2>1.1.0 - Nov 29, 2018</h2>

                <div className="intro">

                    <div className="text-center">

                        <img style={{maxHeight: '200px'}} className="img-fluid" src={EmbeddedImages.POLAR_LOGO}></img>

                        <span style={{fontSize: '85px', margin: '15px'}}>+</span>

                        <img style={{maxHeight: '200px'}} className="img-fluid" src={EmbeddedImages.CHROME_LOGO}></img>

                        <h1 className="title">Polar 1.1 - Chrome Extension Support!</h1>

                    </div>

                    <p>
                        Polar 1.1 is fresh out the door and a lot of amazing features and
                        bug fixes are enabled in this release.
                    </p>

                    <p>
                        The biggest feature by far is our support for
                        the <a href="https://chrome.google.com/webstore/detail/save-to-polar/jkfdkjomocoaljglgddnmhcbolldcafd">'Save to Polar' chrome extension</a> that
                        allows you to send the URL of your active tab to Polar
                        for content capture.
                    </p>

                    <p>
                        This makes it a lot easier to work with Polar as you can
                        just click a button in Chrome and have it sent to Polar.
                    </p>

                    <p>
                        We plan on adding support for Safari, and Firefox in the
                        future but we're taking things one step at a time.
                    </p>

                    <p className="text-center">
                        <a className="btn btn-success btn-lg"
                           href="https://chrome.google.com/webstore/detail/save-to-polar/jkfdkjomocoaljglgddnmhcbolldcafd"
                           role="button">Get the 'Save to Polar' Chrome Extension</a>
                    </p>

                    <h3>Other features in 1.1 include:</h3>

                    <li>
                        Disabling amp for now until we have a better solution on how to show the user
                        that an AMP page is displayed and how to disable / enable it.  Otherwise its
                        confusing and often the amp page is WORSE not better.
                    </li>

                    <li>
                        Fixed bugs with the browser size not changing during capture browser changing
                        and also fixed some issues with it not properly accepting the browser change
                        in some situations.
                    </li>

                    <li>
                        Fixed bug in HTML zoom where the page would be truncated improperly.
                    </li>

                    <li>
                        Blocked amp ads during the capture but they aren't blocked during the preview
                        at the moment.
                    </li>

                    <li>
                        "Fixed" nasty anti-aliasing bug in electron by blocking amp ads. They were
                        annoying anyway but for some reason they were breaking chrome rendering -
                        probably due to some web component nonsense.
                    </li>

                    <li>
                        Implemented a new strategy with the vertical height algorithm in the capture
                        system to revert it back to auto instead of a fixed max-height.  Works a lot
                        better now.
                    </li>

                    <li>
                        Date/times no longer include ' ago' to be a bit more concise.
                    </li>

                    <li>
                        Added small FAQ entry to enable Anki sync.
                    </li>

                    <li>
                        Fixed a bug where we could select text and not properly work with elements.
                    </li>

                    <li>
                        Renderer analytics didn't understand that a callback without an error wasn't
                        a failure.
                    </li>

                    <li>
                        Upgraded a number of important react packages:
                        react react-dom react-moment react-select @types/react-table
                        @types/react-select @types/react @types/prop-types @types/node-fetch
                    </li>

                    <li>
                        removed inversify package (were not using it)
                    </li>

                    <li>
                        latest fontawesome
                    </li>

                    <li>
                        latest node-fetch
                    </li>

                    <li>
                        fixed issue with electron-builder where it was forcing us to upgrade to the
                        latest version for each release.
                    </li>

                </div>


                {/*<h2>1.0.14 - Nov 17, 2018</h2>*/}

                {/*<p className="text-center">*/}

                    {/*<a href="https://kevinburton1.typeform.com/to/SsuiyB">*/}
                        {/*<img src={EmbeddedImages.SURVEY}></img>*/}
                    {/*</a>*/}

                {/*</p>*/}

                {/*<p>*/}
                    {/*Could you take 2 minutes and <a href="https://kevinburton1.typeform.com/to/SsuiyB">answer 10 questions*/}
                    {/*</a> about*/}
                    {/*your use of Polar?  We're trying to focus on the most*/}
                    {/*important features for our user base and your feedback*/}
                    {/*is critical!*/}
                {/*</p>*/}

                {/*<h3>Project Update</h3>*/}

                {/*<p>*/}
                    {/*The 10.0.14 release focuses mostly on fit and finish.  This*/}
                    {/*is mostly a bug fix release but some of these were important.*/}
                {/*</p>*/}

                {/*<p>*/}
                    {/*The big news is all under the covers and we're about a week*/}
                    {/*away from having functional cloud sync.  The cloud sync*/}
                    {/*support will also be the basis for our online document*/}
                    {/*collaboration as well as mobile sync so it's going to be*/}
                    {/*really exciting to turn on this new functionality.*/}
                {/*</p>*/}

                {/*<h3>What's new in 10.0.14:</h3>*/}

                {/*<li>*/}
                    {/*Fixed bug where the lightbox was kept enabled after we*/}
                    {/*deleted an annotation*/}
                {/*</li>*/}

                {/*<li>*/}
                    {/*We can now capture a new class of documents that use a*/}
                    {/*vertical height on their CSS selectors.*/}
                {/*</li>*/}

                {/*<li>*/}
                    {/*We can now capture XML documents which used XSL stylesheets.*/}
                {/*</li>*/}

                {/*<li>*/}
                    {/*Major refactor of the disk datastore for the pending cloud*/}
                    {/*sync functionality we're working on.*/}
                {/*</li>*/}

                {/*<ul>*/}

                {/*</ul>*/}

                {/*<h2>1.0.12 - Nov 9, 2018</h2>*/}

                {/*<ul>*/}

                    {/*<li>*/}
                        {/*Feature: drag and drop for bulk PDF import works.*/}
                    {/*</li>*/}

                    {/*<li> Feature: The "Delete" text is now danger red.*/}
                    {/*</li>*/}

                    {/*<li> Feature: Implemented a confirm prompt when*/}
                    {/*deleteing flashcards, comments, and annotations.*/}
                    {/*</li>*/}

                    {/*<li> Feature: Implemented Cancel when creating*/}
                    {/*flashcards and comments </li>*/}

                    {/*<li> Feature: Reworked anki sync to run from the doc*/}
                    {/*repository. </li>*/}

                    {/*<li> Feature: Renamed "Copy URL" to "Copy Original*/}
                    {/*URL" </li>*/}

                    {/*<li> Fixed analytics around number of documents in*/}
                        {/*the repository </li>*/}

                    {/*<li> Upgrade to Electron 3.0.8 </li>*/}

                    {/*<li> Fixed bug with Electron generating an error*/}
                    {/*window on exit due to a conversion of the wrong type*/}
                    {/*to an integer.  This was/is an Electron bug. </li>*/}

                {/*</ul>*/}

                {/*<h2>1.0.10 - Nov 1, 2018</h2>*/}

                {/*<p>*/}
                    {/*A bunch of changes went into this release.  Most importantly*/}
                    {/*we've setup an <a href="https://opencollective.com/polar-bookshelf">*/}
                    {/*Open Collective project</a> to accept donations for helping support Polar*/}
                    {/*development.*/}
                {/*</p>*/}

                {/*<p>*/}
                    {/*I would personally appreciate it if you sponsored*/}
                    {/*Polar as it took me about two months of development*/}
                    {/*time and nearly $1k of my own funds to launch the*/}
                    {/*project.  We still have additional costs including*/}
                    {/*continuous integration builds, hosting costs, etc.*/}
                {/*</p>*/}

                {/*<p className="text-center">*/}
                    {/*<a href="https://opencollective.com/polar-bookshelf/donate" target="_blank">*/}
                        {/*<img src="https://opencollective.com/polar-bookshelf/donate/button@2x.png?color=blue" width="300" />*/}
                    {/*</a>*/}
                {/*</p>*/}

                {/*<h3>Bulk Import</h3>*/}

                {/*<p>*/}
                    {/*This is probably the biggest new feature in this*/}
                    {/*release.  This allows you to import a large collection*/}
                    {/*of PDFs in a directory by selecting multiple PDFs you*/}
                    {/*would like to important*/}
                    {/*via <code>File | Import</code> and they will be*/}
                    {/*imported into Polar along with any*/}
                    {/*potential metadata (title and number of pages).*/}
                {/*</p>*/}

                {/*<p>*/}
                    {/*Other important features in this release include:*/}
                {/*</p>*/}

                {/*<ul>*/}

                    {/*<li>*/}
                        {/*Change capture key binding*/}
                        {/*to <code>CommandOrControl+N</code> (new).*/}
                        {/*The other key binding conflicted with window*/}
                        {/*management in Chrome and we might want to use those*/}
                        {/*key bindings in the future.*/}
                    {/*</li>*/}

                    {/*<li> Refactored the way we're handling popups for*/}
                        {/*the annotation bar.  I think this will resolve most*/}
                        {/*of the issues we're having but there are still a few*/}
                        {/*more glitches to be fixed. </li>*/}

                    {/*<li> Reworked the capture preview browser so that*/}
                        {/*buttons are only enabled after you first load a URL*/}
                        {/*so that it's not confusing for the user. </li>*/}

                {/*</ul>*/}
            </div>
        );
    }

}

interface IProps {
}

interface IState {
}
