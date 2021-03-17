import * as React from 'react';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {RightSidebar} from "../../js/ui/motion/RightSidebar";
import {SchoolSelectDemo} from "./SchoolSelectDemo";
import {ScrollAutoLoaderDemo} from './ScrollAutoLoaderDemo';

const styles = {
    swatch: {
        width: '30px',
        height: '30px',
        float: 'left',
        borderRadius: '4px',
        margin: '0 6px 6px 0',
    }
};

const Folders = () => {
    return <div style={{backgroundColor: 'red', overflow: 'auto'}}>
        these are the folders
    </div>;
};

const Preview = () => {
    return <div style={{backgroundColor: 'orange', overflow: 'auto'}}>
        This is the preview
    </div>;
};


const Main = () => {
    return <div style={{backgroundColor: 'blue'}}>this is the right</div>;
};


const ThirdPage = () => (
    <div>
        this is the third page just inside a basic div
    </div>
);

// const LeftSidebarPage = () => (
//
//     <LeftSidebar style={{backgroundColor: 'red'}}>
//         <div>
//             this is the left sidebar
//         </div>
//     </LeftSidebar>
//
// );

const RightSidebarPage = () => (

    <RightSidebar style={{backgroundColor: 'red'}} onClose={NULL_FUNCTION}>
        <div>
            this is the left sidebar
        </div>
    </RightSidebar>

);

export class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

    }

    public render() {

        return (
            <ScrollAutoLoaderDemo/>
            // <div>
            //     {/*<KeyBindingDemo/>*/}
            //     {/*<DragAndResizeDemo/>*/}
            //
            // </div>
        );

        //
        // const dockPanels: ReadonlyArray<DockPanel> = [
        //     {
        //         id: "left-sidebar",
        //         type: 'fixed',
        //         component: <div>left</div>,
        //         width: 350
        //     },
        //     {
        //         id: "main",
        //         type: 'grow',
        //         component: <div>main</div>,
        //         grow: 1
        //     },
        //     {
        //         id: "right-sidebar",
        //         type: 'fixed',
        //         component: <div>right</div>,
        //         width: 350
        //     }
        //
        // ];

        // const LeftSidebar = () => (
        //     <div style={{
        //              position: 'absolute',
        //              left: 0,
        //              top: 0,
        //              width: '350px',
        //              height: '100%',
        //              backgroundColor: 'orange'
        //          }}>
        //
        //     </div>
        // )

        // const LeftSidebar = (props: any) => {
        //
        //     const style = useSpring({
        //         position: 'absolute',
        //         left: 0,
        //         top: 0,
        //         width: '350px',
        //         height: '100%',
        //         from: {
        //             transform: 'translateX(-100%)'
        //         },
        //         to: {
        //             transform: 'translateX(0%)'
        //         }
        //     });
        //
        //     return <animated.div style={style}>
        //         {props.children}
        //     </animated.div>;
        //
        // };

        // const [sidebar, toggleSidebar] = LeftSidebars.create({
        //     style: {
        //         backgroundColor: 'red',
        //     },
        //     children: <div>this is the sidebar</div>
        //
        // });

        // return (
        //
        //     <div>
        //         <SlideFromBottom>
        //             this is the fade in
        //         </SlideFromBottom>
        //     </div>
        //
        // );

        // return (
        //     <BottomSheet>
        //         01. this is the bottom sheet<br/>
        //         02. this is the bottom sheet<br/>
        //         03. this is the bottom sheet<br/>
        //         04. this is the bottom sheet<br/>
        //         05. this is the bottom sheet<br/>
        //         06. this is the bottom sheet<br/>
        //         07. this is the bottom sheet<br/>
        //         08. this is the bottom sheet<br/>
        //         09. this is the bottom sheet<br/>
        //     </BottomSheet>
        // );

        //
        // const FooComponent = () => {
        //
        //     const items = [
        //         <div>hello world</div>
        //     ];
        //
        //     return <Transition
        //         items={items}
        //         from={{ opacity: 0 }}
        //         enter={{ opacity: 1 }}
        //         leave={{ opacity: 0 }}>
        //         {show => show && (props => <div style={props}>this is the thing️</div>)}
        //     </Transition>;
        //
        // };
        //
        // const FooToggler = () => {
        //
        //     const [show, toggle] = useState(true);
        //
        //     const ToggleButton = () => <Button onClick={() => toggle(! show)}>toggle</Button>;
        //
        //     if (show) {
        //         return <div>
        //             <ToggleButton/>
        //             <FooComponent/>
        //         </div>;
        //     } else {
        //         return <div>
        //             <ToggleButton/>
        //         </div>;
        //     }
        //
        // };

        // const Cat = () => {
        //     const [show, set] = useState(true);
        //     const transitions = useTransition(show, null, {
        //         from: {position: 'absolute', opacity: 1},
        //         enter: {opacity: 1},
        //         leave: {opacity: 0},
        //     });
        //
        //     console.log("FIXME HERE");
        //
        //     return <animated.div key='asdf' style={props}>✌️</animated.div>;
        //
        // };

        // const Bar = () => {
        //     const [state, toggle] = useState(true)
        //     const transitions = useTransition(state, null, {  })
        //
        //     return transitions.map(({ item, key, props }) => item && <animated.div key={key} style={props}/>;
        // };

        // return <FooToggler/>;
        //
        // const FramerToggler = () => {
        //
        //     const [visible, toggle] = useState(true);
        //
        //     const ToggleButton = () => <Button onClick={() => toggle(! visible)}>toggle</Button>;
        //
        //     return (
        //         <AnimatePresence>
        //             <ToggleButton key={1}/>
        //             {visible && (
        //                 <motion.div
        //                     key={2}
        //                     initial={{ opacity: 0 }}
        //                     animate={{ opacity: 1 }}
        //                     exit={{ opacity: 0 }}>
        //
        //                     hello world
        //                 </motion.div>
        //             )}
        //         </AnimatePresence>
        //     );
        // };
        //
        // return <FramerToggler/>;
        const animation = {
            initial: { opacity: 0 },
            active: {
                opacity: 1,
                transition: {
                    delay: 0.3,
                    when: 'beforeChildren',
                    staggerChildren: 0.1,
                },
            },
            exit: { opacity: 0, y: 200 },
        };

        // const transition = { type: 'spring', damping, stiffness };
        //
        // const loc = ReactRouters.createLocationWithPathAndHash();
        //
        // const foo = () => <div/>;
        //
        // const docMeta = MockDocMetas.createMockDocMeta();
        // const pageMeta = docMeta.pageMetas[1];
        //
        // Preconditions.assertPresent(pageMeta);
        //


        // const DocAnnotations.createFromFlashcard(docMeta, flashcard, pageMeta)
        //
        // ReviewerTasks.createFlashcardTasks();

        return (

            <div className="m-2">

                {/*<TagChickletDemo/>*/}
                <SchoolSelectDemo/>

                {/*<KeyDownDemo/>*/}

                {/*<ReviewerDemo/>*/}

                {/*<NewToasts/>*/}

                {/*<FakePagemark/>*/}

                {/*<AddContentButtonOverlay onAdd={NULL_FUNCTION}/>*/}

                {/*<devices.Handheld onAdd={NULL_FUNCTION}/>*/}

                {/*<AnimatedRoutes/>*/}

                {/*<div className="m-5">*/}

                {/*    <InputGroup>*/}
                {/*        <InputGroupAddon addonType="prepend">*/}
                {/*            <InputGroupText className="pl-1 pr-1 bg-primary text-white">*/}
                {/*                <FilterIcon/>*/}
                {/*            </InputGroupText>*/}
                {/*        </InputGroupAddon>*/}

                {/*        <Input id="foo"*/}
                {/*               type="text"*/}
                {/*               className="btn-no-outline"*/}
                {/*               placeholder="hello world"*/}
                {/*               defaultValue="">*/}

                {/*        </Input>*/}

                {/*    </InputGroup>*/}

                {/*    <br/>*/}
                {/*    <br/>*/}
                {/*    <br/>*/}

                {/*    <InputFilter/>*/}
                {/*</div>*/}

                {/*<Lightbox>*/}
                {/*    <div style={{display: 'flex'}} className="m-5">*/}
                {/*        <div className="m-auto">*/}
                {/*            <DropBox style={{width: '350px', height: '350px'}}/>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</Lightbox>*/}

                {/*<ScaleAndFadeIn>*/}
                {/*    hello world!*/}
                {/*</ScaleAndFadeIn>*/}

                {/*<SwitchButton size="lg" onChange={NULL_FUNCTION}/>*/}

                {/*<BlackoutCurtain/>*/}
            </div>

            // {/*<BrowserRouter>*/}
            //
            // {/*    <Link to={{hash: '#home'}}>home</Link>*/}
            // {/*    <Link to={{hash: '#second'}}>second</Link>*/}
            //
            // {/*    <Switch location={ReactRouters.createLocationWithHashOnly()}>*/}
            //
            // {/*        /!*<CachedRoute key={0} exact path='#home' component={() => <FirstPage/>} />*!/*/}
            // {/*        /!*<CachedRoute key={1} exact path='#second' component={() => <SecondPage/>} />*!/*/}
            // {/*        <Route key={0} exact path='#home' component={foo} />*/}
            //
            // {/*    </Switch>*/}
            //
            // {/*</BrowserRouter>*/}
            //

            //
            // <ReviewerModal>
            //     <PageTransition>
            //
            //         <div style={{
            //             display: 'flex'
            //         }}>
            //             <div className="ml-auto mr-auto text-center"
            //                  style={{
            //                      maxWidth: '350px',
            //                      width: '350px'
            //                  }}>
            //
            //                 <Pulse>
            //                     <PolarSVGIcon/>
            //                 </Pulse>
            //
            //                 <IndeterminateProgressBar/>
            //
            //                 <h2 className="text-muted mt-2">
            //                     LOADING
            //                 </h2>
            //
            //                 <p className="text-grey400 text-lg">
            //                     One moment.  Doing some cool computational stuff.
            //                 </p>
            //
            //             </div>
            //         </div>
            //
            //     </PageTransition>
            // </ReviewerModal>

            //
            // <PageTransition>
            //
            //     <div style={{
            //         display: 'flex'
            //     }}>
            //         <div className="ml-auto mr-auto"
            //              style={{
            //                  maxWidth: '350px',
            //                  width: '350px'
            //              }}>
            //
            //             <Pulse>
            //                 <PolarSVGIcon/>
            //             </Pulse>
            //
            //             <IndeterminateProgressBar/>
            //
            //         </div>
            //     </div>
            //
            // </PageTransition>
            //
            // <motion.div style={{
            //                position: 'absolute',
            //                left: 0,
            //                top: 0,
            //                width: '100%',
            //                height: '100%',
            //                backgroundColor: 'red'
            //             }}
            //             drag="x"
            //             onDragStart={() => console.log("drag start")}
            //             onDragEnd={() => console.log("drag end")}>
            //
            //
            // </motion.div>

                // <div className="mt-5"
                //      style={{
                //          display: 'flex',
                //          overflow: 'hidden'
                //      }}>
                //     <div className="ml-auto mr-auto border"
                //          style={{
                //              maxWidth: '350px',
                //              width: '350px'
                //          }}>
                //
                //         <SlideFromRight>
                //             <PolarSVGIcon/>
                //         </SlideFromRight>
                //
                //     </div>
                // </div>


            // <BottomSheet>
            //
            //     <h1>
            //         This is the bottom sheet.  It's pretty awesome!
            //     </h1>
            //
            // </BottomSheet>

            // <BrowserRouter key="browser-router">
            //
            //     <Link to={{hash: '#'}}>home</Link>
            //     <Link to={{hash: '#second'}}>second</Link>
            //     <Link to={{hash: '#third'}}>third</Link>
            //     <Link to={{hash: '#sidebar'}}>sidebar</Link>
            //
            //     <Route render={({ location }) => (
            //         <AnimatePresence exitBeforeEnter initial={false}>
            //             <Switch location={loc}>
            //
            //                 <Route key={0} exact path='/web/spectron0/ui-components/content.html' component={FirstPage} />
            //                 <Route key={1} exact path='/web/spectron0/ui-components/content.html#second' component={SecondPage} />
            //                 <Route key={2} exact path='/web/spectron0/ui-components/content.html#third' component={ThirdPage} />
            //                 <Route key={3} exact path='/web/spectron0/ui-components/content.html#sidebar' component={RightSidebarPage} />
            //
            //             </Switch>
            //         </AnimatePresence>
            //         )}/>
            //
            // </BrowserRouter>

            //
            // <HashRouter key="hash-router" hashType="noslash">
            //
            //     HashRouter:
            //
            //     {/*NOTE: this works... but I do not want to use this syntax. I want the hash syntax.*/}
            //     {/*<Link to="/settings">settings</Link>*/}
            //     {/*<Link to="/help">help</Link>*/}
            //
            //     {/*<Link to={{hash: '#settings'}}>settings</Link>*/}
            //      {/*<Link to={{hash: '#help'}}>help</Link>*/}
            //
            //      {/*<a href="#settings">settings</a>*/}
            //      {/*<a href="#home">home</a>*/}
            //
            //     <Switch>
            //
            //         <Route path='/settings'
            //                render={() => <div>settings page</div>}/>
            //
            //         <Route path='/help'
            //                render={() => <div>help page</div>}/>
            //
            //     </Switch>
            //
            // </HashRouter>

            //
            // <BrowserRouter key="browser-router">
            //
            //     BrowserRouter with hash only
            //
            //     <Link to="#settings">settings</Link>
            //     <Link to="#help">help</Link>
            //
            //     <Switch location={ReactRouters.createLocationWithHashOnly()}>
            //
            //          <Route path='#settings'
            //                 render={() => <div>settings page</div>}/>
            //
            //          <Route path='#help'
            //                 render={() => <div>help page</div>}/>
            //
            //     </Switch>
            //
            // </BrowserRouter>
            //
            // <BrowserRouter key="browser-router">
            //
            //     BrowserRouter with hash only
            //
            //     <Link to="#settings">settings</Link>
            //     <Link to="#help">help</Link>
            //
            //     <Switch location={ReactRouters.createLocationWithHashOnly()}>
            //
            //          <Route path='#settings'
            //                 render={() => <div>settings page</div>}/>
            //
            //          <Route path='#help'
            //                 render={() => <div>help page</div>}/>
            //
            //     </Switch>
            //
            //     <Switch location={ReactRouters.createLocationWithHashOnly()}>
            //
            //         <Route path='#help'
            //                render={() => <div>help page 2</div>}/>
            //
            //     </Switch>
            //
            //
            // </BrowserRouter>
        );

        // <Route render={({ location }) => (
        //     <AnimatePresence exitBeforeEnter>
        //         <motion.div
        //             initial={animation.initial}
        //             animate={animation.active}
        //             exit={animation.exit}
        //             // transition={transition}
        //         >
        //             <Switch location={loc}>
        //
        //                 <Route key={0} exact path='/web/spectron0/ui-components/content.html' render={() => <div>main</div>} />
        //                 <Route key={1} exact path='/web/spectron0/ui-components/content.html#second' component={SecondPage} />
        //                 <Route key={2} exact path='/web/spectron0/ui-components/content.html#third' component={() => <div>third</div>} />
        //
        //             </Switch>
        //         </motion.div>
        //     </AnimatePresence>
        // )}/>
        //


        // return (
        //
        //     <BrowserRouter key="browser-router">
        //
        //         <Link to={{hash: '#'}}>home</Link>
        //         <Link to={{hash: '#second'}}>second</Link>
        //         <Link to={{hash: '#second'}}>third</Link>
        //         <Switch location={ReactRouters.createLocationWithPathAndHash()} >
        //
        //             <Route exact path='/web/spectron0/ui-components/content.html' render={() => <div>main</div>} />
        //             <Route exact path='/web/spectron0/ui-components/content.html#second' component={SecondPage} />
        //             <Route exact path='/web/spectron0/ui-components/content.html#third' component={() => <div>third</div>} />
        //
        //         </Switch>
        //     </BrowserRouter>
        // );

        // const isVisible = true;
        //
        // return <AnimatePresence>
        //         {isVisible && (
        //             <motion.div
        //                 initial={{ opacity: 0 }}
        //                 animate={{ opacity: 1 }}
        //                 exit={{ opacity: 0 }}>
        //
        //                 hello world
        //             </motion.div>
        //         )}
        //     </AnimatePresence>;

        // return (
        //     // <DockLayout dockPanels={dockPanels}/>
        //
        //     // <ReviewFinished/>
        //     //
        //     // <BottomSheet>
        //     //     asdfasfd
        //     // </BottomSheet>
        //
        //
        // );

    }


}

interface IAppState {

}


