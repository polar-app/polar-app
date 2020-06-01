import * as React from 'react';
import {Dock} from '../../../../web/js/ui/dock/Dock';
import {Devices} from "polar-shared/src/util/Devices";
import {AnnotationRepoTable2} from "./AnnotationRepoTable2";

const Main = React.memo(() => (

    <div style={{
        display: 'flex' ,
        flexDirection: 'column',
        minHeight: 0
    }}>

        <AnnotationRepoTable2 />

    </div>

));


const Default = React.memo(() => {

    return (

        <Dock componentClassNames={{
              }}
              left={
                  <Main />
              }
              right={
                  <div className="mt-2 pl-1 pr-1">
                      {/*<AnnotationPreviewView persistenceLayerManager={this.props.persistenceLayerManager}*/}
                      {/*                       repoDocMetaUpdater={this.props.repoDocMetaUpdater}*/}
                      {/*                       tagsProvider={this.props.tagsProvider}*/}
                      {/*                       repoAnnotation={this.props.repoAnnotation}/>*/}
                  </div>
              }
              side='left'
              initialWidth={450}/>
    );

});

const Phone = React.memo(() => (
    <Main/>
));



export const PreviewAndMainViewDock = React.memo(() => {

    if (Devices.get() === 'phone') {
        return <Phone/>;
    } else {
        return <Default/>;
    }

});

