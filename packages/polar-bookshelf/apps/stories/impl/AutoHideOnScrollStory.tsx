import Slide from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import React, {useRef} from 'react';
import {FixedNav} from "../../repository/js/FixedNav";
import {DeviceRouter} from "../../../web/js/ui/DeviceRouter";
import {AppBar, Box, Fab, Toolbar, Zoom} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddIcon from "@material-ui/icons/Add";

interface Props {

    /**
    * Injected by the documentation to work in an iframe.
    * You won't need it on your project.
    */
    readonly target?: Window | Node
    readonly children: React.ReactElement;

}

function HideOnScrollUsingSlide(props: Props) {

    const { children, target } = props;

    const trigger = useScrollTrigger({
        target: props.target,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );

}

function HideOnScrollUsingZoom(props: Props) {

    const { children, target } = props;

    const trigger = useScrollTrigger({
        target: props.target,
    });

    return (
        <Zoom appear={false} in={!trigger}>
            {children}
        </Zoom>
    );

}


const LoremIpsumContent = () => {
    return (
        <>
            <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam sollicitudin tempor id eu nisl. Morbi blandit cursus risus at. Integer malesuada nunc vel risus commodo viverra maecenas. Nunc sed blandit libero volutpat sed cras ornare arcu. Porttitor eget dolor morbi non arcu risus quis varius quam. Sit amet tellus cras adipiscing enim. Pharetra convallis posuere morbi leo urna. Magna fermentum iaculis eu non diam phasellus vestibulum. Tellus at urna condimentum mattis pellentesque. Ornare massa eget egestas purus viverra accumsan in nisl nisi. Risus viverra adipiscing at in tellus integer. Nibh tellus molestie nunc non blandit massa enim nec. Et malesuada fames ac turpis. Velit aliquet sagittis id consectetur purus ut. Orci ac auctor augue mauris augue neque gravida in fermentum.
            </p>
            <p>
                    Eu facilisis sed odio morbi quis commodo odio. Nullam vehicula ipsum a arcu cursus vitae congue. Aliquet porttitor lacus luctus accumsan. Justo laoreet sit amet cursus. Viverra adipiscing at in tellus integer. Aliquam purus sit amet luctus venenatis. Auctor urna nunc id cursus. Diam vulputate ut pharetra sit amet aliquam id diam. Ornare quam viverra orci sagittis eu volutpat odio. Quis commodo odio aenean sed adipiscing diam donec adipiscing. Mattis ullamcorper velit sed ullamcorper morbi tincidunt. Non curabitur gravida arcu ac tortor dignissim convallis. Quam adipiscing vitae proin sagittis nisl. Ut eu sem integer vitae justo eget. In hac habitasse platea dictumst quisque sagittis purus sit. Commodo sed egestas egestas fringilla.
            </p>

            <p>
                    Ut placerat orci nulla pellentesque dignissim enim sit. Pellentesque massa placerat duis ultricies lacus sed turpis tincidunt. Proin sed libero enim sed faucibus turpis in eu. Orci sagittis eu volutpat odio facilisis mauris sit amet. In hac habitasse platea dictumst. Lacus vestibulum sed arcu non odio. At ultrices mi tempus imperdiet nulla malesuada pellentesque. Tellus in hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Turpis egestas sed tempus urna et pharetra pharetra massa. Cursus vitae congue mauris rhoncus.
            </p>

            <p>
                    Sit amet venenatis urna cursus eget nunc scelerisque viverra mauris. Varius sit amet mattis vulputate enim nulla aliquet porttitor lacus. Purus gravida quis blandit turpis cursus. Vulputate sapien nec sagittis aliquam malesuada. Integer quis auctor elit sed vulputate. Tellus pellentesque eu tincidunt tortor aliquam nulla facilisi. Amet tellus cras adipiscing enim eu turpis egestas. Justo nec ultrices dui sapien eget. Accumsan sit amet nulla facilisi morbi tempus iaculis urna. Sed ullamcorper morbi tincidunt ornare massa eget egestas.
            </p>

            <p>
                    Non quam lacus suspendisse faucibus interdum posuere lorem ipsum. Enim nunc faucibus a pellentesque sit amet porttitor. Ultrices vitae auctor eu augue. Posuere lorem ipsum dolor sit amet consectetur. Malesuada fames ac turpis egestas sed tempus urna et pharetra. Risus in hendrerit gravida rutrum quisque non tellus orci. Bibendum neque egestas congue quisque egestas. Feugiat nisl pretium fusce id velit. Pharetra diam sit amet nisl suscipit adipiscing bibendum. Ac turpis egestas integer eget aliquet nibh. Amet nisl suscipit adipiscing bibendum est ultricies. Lacus suspendisse faucibus interdum posuere lorem ipsum dolor. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae. Sed arcu non odio euismod lacinia at quis risus sed. Pellentesque dignissim enim sit amet venenatis urna cursus eget nunc. Nulla pharetra diam sit amet nisl.
            </p>

            <p>
                    Tortor at risus viverra adipiscing at in tellus. Consectetur adipiscing elit pellentesque habitant morbi tristique. Vulputate eu scelerisque felis imperdiet proin fermentum leo vel orci. Risus ultricies tristique nulla aliquet. Volutpat odio facilisis mauris sit amet massa vitae. Id interdum velit laoreet id donec. Mattis aliquam faucibus purus in massa tempor. In egestas erat imperdiet sed. Augue interdum velit euismod in pellentesque massa. Risus feugiat in ante metus dictum at. Felis eget velit aliquet sagittis id consectetur purus ut. Aliquam faucibus purus in massa tempor nec. Malesuada nunc vel risus commodo viverra maecenas. Mi tempus imperdiet nulla malesuada. Sed odio morbi quis commodo odio aenean. Et tortor consequat id porta nibh venenatis cras sed felis. Volutpat blandit aliquam etiam erat velit scelerisque. Volutpat diam ut venenatis tellus in metus vulputate. Risus sed vulputate odio ut. Nec nam aliquam sem et tortor consequat id porta.
            </p>

            <p>
                    Id aliquet risus feugiat in. Accumsan lacus vel facilisis volutpat est velit egestas dui. Cursus in hac habitasse platea dictumst quisque. Venenatis a condimentum vitae sapien pellentesque. Tempus iaculis urna id volutpat. Ut consequat semper viverra nam libero justo laoreet. Quisque sagittis purus sit amet. Volutpat diam ut venenatis tellus in metus. Imperdiet massa tincidunt nunc pulvinar sapien et. Congue mauris rhoncus aenean vel elit scelerisque. Tellus cras adipiscing enim eu turpis egestas pretium aenean. Volutpat consequat mauris nunc congue.
            </p>

            <p>
                    Commodo viverra maecenas accumsan lacus vel facilisis volutpat est. Justo laoreet sit amet cursus sit amet dictum sit amet. Nec feugiat in fermentum posuere. Urna cursus eget nunc scelerisque viverra mauris in aliquam. Nunc id cursus metus aliquam eleifend mi in. Dolor morbi non arcu risus quis varius quam. Aliquam nulla facilisi cras fermentum odio eu feugiat pretium. Tristique magna sit amet purus gravida. Consequat semper viverra nam libero justo. Morbi tincidunt augue interdum velit euismod in. Sit amet mauris commodo quis imperdiet. Etiam erat velit scelerisque in dictum non consectetur a.
            </p>

            <p>
                    Massa ultricies mi quis hendrerit dolor magna eget est. Aliquam vestibulum morbi blandit cursus risus at. Non arcu risus quis varius quam quisque. Consequat ac felis donec et odio pellentesque diam volutpat commodo. Elementum nisi quis eleifend quam adipiscing vitae proin sagittis. Arcu vitae elementum curabitur vitae nunc sed. Pellentesque pulvinar pellentesque habitant morbi tristique senectus. Sit amet justo donec enim diam vulputate ut. Adipiscing tristique risus nec feugiat in fermentum. Bibendum ut tristique et egestas quis ipsum suspendisse. Sed id semper risus in hendrerit gravida rutrum quisque. Vitae purus faucibus ornare suspendisse sed nisi lacus sed.
            </p>

            <p>
                    Adipiscing at in tellus integer feugiat scelerisque varius morbi enim. Eget mauris pharetra et ultrices neque ornare aenean euismod elementum. Nec ullamcorper sit amet risus nullam eget felis eget. Sem fringilla ut morbi tincidunt augue interdum velit. Aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant. Sem nulla pharetra diam sit amet nisl. Sollicitudin aliquam ultrices sagittis orci a scelerisque purus semper eget. Id donec ultrices tincidunt arcu non sodales neque sodales. Facilisis leo vel fringilla est ullamcorper eget nulla facilisi. Et ultrices neque ornare aenean euismod elementum nisi quis eleifend. Sed egestas egestas fringilla phasellus faucibus scelerisque. Nec tincidunt praesent semper feugiat nibh. Praesent semper feugiat nibh sed pulvinar proin gravida hendrerit lectus. Lectus magna fringilla urna porttitor rhoncus. Commodo viverra maecenas accumsan lacus vel facilisis volutpat est velit. Quisque egestas diam in arcu. Sed euismod nisi porta lorem mollis aliquam.
            </p>

            <p>
                    At varius vel pharetra vel turpis nunc eget lorem. Elementum curabitur vitae nunc sed velit dignissim sodales ut eu. Nam at lectus urna duis convallis convallis tellus id. Felis eget velit aliquet sagittis. Rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant. Sollicitudin ac orci phasellus egestas tellus rutrum tellus pellentesque eu. Massa sapien faucibus et molestie ac feugiat sed lectus vestibulum. Congue nisi vitae suscipit tellus mauris. Eget gravida cum sociis natoque penatibus. Turpis massa sed elementum tempus egestas sed. Tortor dignissim convallis aenean et tortor at risus.
            </p>

            <p>
                    Dui sapien eget mi proin. Nisi porta lorem mollis aliquam ut. Porttitor massa id neque aliquam vestibulum morbi blandit cursus risus. Sit amet cursus sit amet. Elementum tempus egestas sed sed risus pretium quam. Cursus euismod quis viverra nibh cras pulvinar. Consectetur lorem donec massa sapien. Sit amet mattis vulputate enim nulla aliquet porttitor. Viverra ipsum nunc aliquet bibendum enim facilisis. Etiam non quam lacus suspendisse faucibus interdum posuere lorem. Pulvinar sapien et ligula ullamcorper malesuada proin libero nunc consequat. Vulputate sapien nec sagittis aliquam malesuada bibendum. Massa id neque aliquam vestibulum.
            </p>

            <p>
                    Donec et odio pellentesque diam volutpat commodo sed egestas. Quisque id diam vel quam elementum. Amet consectetur adipiscing elit ut. Morbi tristique senectus et netus. Urna id volutpat lacus laoreet. In aliquam sem fringilla ut morbi. Dui ut ornare lectus sit. Posuere morbi leo urna molestie at elementum eu. Nisl nisi scelerisque eu ultrices vitae auctor. Sed velit dignissim sodales ut. Fusce id velit ut tortor pretium. Id aliquet risus feugiat in. Elementum tempus egestas sed sed. Malesuada proin libero nunc consequat interdum varius sit amet mattis. Interdum velit laoreet id donec. Velit aliquet sagittis id consectetur purus ut faucibus pulvinar. Felis bibendum ut tristique et egestas quis ipsum suspendisse ultrices. Nisi vitae suscipit tellus mauris a diam maecenas. In eu mi bibendum neque egestas congue quisque egestas. Quam quisque id diam vel quam elementum.
            </p>

            <p>
                    Rhoncus urna neque viverra justo nec ultrices. Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at. Ultrices eros in cursus turpis massa. Sit amet justo donec enim diam vulputate ut. Duis ut diam quam nulla. Interdum posuere lorem ipsum dolor sit. Tempus quam pellentesque nec nam aliquam. Tincidunt vitae semper quis lectus. Egestas sed tempus urna et pharetra. Ac felis donec et odio pellentesque diam volutpat. Urna neque viverra justo nec ultrices. Tempus iaculis urna id volutpat lacus laoreet. Massa vitae tortor condimentum lacinia. Urna condimentum mattis pellentesque id nibh tortor id. Netus et malesuada fames ac. Imperdiet proin fermentum leo vel orci porta non pulvinar neque.
            </p>

            <p>
                    In pellentesque massa placerat duis ultricies lacus. Netus et malesuada fames ac. Scelerisque felis imperdiet proin fermentum. Non sodales neque sodales ut etiam. Erat nam at lectus urna duis convallis convallis tellus id. Vulputate odio ut enim blandit volutpat maecenas. Porttitor eget dolor morbi non. Ipsum a arcu cursus vitae congue mauris. Morbi tristique senectus et netus et malesuada fames ac. Ultrices vitae auctor eu augue ut lectus. Hac habitasse platea dictumst vestibulum rhoncus est. Odio pellentesque diam volutpat commodo sed egestas. Consequat id porta nibh venenatis. Cursus vitae congue mauris rhoncus. Quam quisque id diam vel quam elementum pulvinar. Nibh tortor id aliquet lectus. Aliquam ut porttitor leo a diam sollicitudin. Dignissim sodales ut eu sem integer. Sed lectus vestibulum mattis ullamcorper velit.
            </p>
        </>
    );
}

interface AutoHidePageLayoutProps {
    readonly title: string;
    readonly children: JSX.Element;
}

export const AutoHidePageLayout = (props: AutoHidePageLayoutProps) => {

    const [scrollElement, setScrollElementState] = React.useState<HTMLDivElement | null>(null)

    return (

        <div className="AdaptivePageLayout"
             style={{
                 display: 'flex',
                 flexDirection: 'column',
                 flexGrow: 1,
                 minWidth: 0,
                 minHeight: 0,
             }}
             >

            <DeviceRouter.Handheld>
                <>
                    <HideOnScrollUsingSlide target={scrollElement || undefined}>
                        <AppBar>
                            <Toolbar>

                                <IconButton>
                                    <ArrowBackIcon/>
                                </IconButton>

                                {props.title}

                            </Toolbar>
                        </AppBar>
                    </HideOnScrollUsingSlide>

                    <Toolbar/>

                </>

            </DeviceRouter.Handheld>

            <div style={{
                     display: 'flex',
                     flexGrow: 1,
                     minHeight: 0,
                     minWidth: 0,
                 }}
                 >

                <div style={{
                         overflow: 'auto',
                         flexGrow: 1
                     }}
                     ref={ref => setScrollElementState(ref)}>

                    <div
                         style={{
                             maxWidth: '700px',
                         }}
                         >

                        {props.children}

                    </div>

                </div>

            </div>

            <HideOnScrollUsingZoom target={scrollElement || undefined}>
                <Fab color="primary" aria-label="add"
                     style={{
                         position: 'absolute',
                         right: '16px',
                         bottom: '16px'
                     }}>
                    <AddIcon />
                </Fab>
            </HideOnScrollUsingZoom>

        </div>

    );

}


export const AutoHideOnScrollStory = () => {

    return (

        <AutoHidePageLayout title="Auto Hide">
            <LoremIpsumContent/>
        </AutoHidePageLayout>

    );

}
