import * as React from 'react';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {IEventDispatcher} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import AnnotationRepoTable from './AnnotationRepoTable';
import {RepoAnnotation} from '../RepoAnnotation';
import {RepoAnnotationMetaView} from './RepoAnnotationMetaView';
import {AnnotationRepoFilterBar} from './filter_bar/AnnotationRepoFilterBar';
import {UpdateFiltersCallback} from './AnnotationRepoFiltersHandler';
import {Dock} from '../../../../web/js/ui/dock/Dock';
import {NullCollapse} from "../../../../web/js/ui/null_collapse/NullCollapse";
import {Platforms} from "../../../../web/js/util/Platforms";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Devices} from "../../../../web/js/util/Devices";

export default class PreviewAndMainViewDock extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        if (Devices.get() === 'phone') {
            return <PreviewAndMainViewDock.Phone {...this.props}/>
        } else {
            return <PreviewAndMainViewDock.Default {...this.props}/>
        }

    }

    private onRepoAnnotationSelected(repoAnnotation: RepoAnnotation) {
        // console.log("A repo annotation was selected: " , repoAnnotation);

        this.setState({repoAnnotation});

    }

    public static Main = class extends PreviewAndMainViewDock {

        public render() {

            return (

                <div style={{display: 'flex' , flexDirection: 'column', height: '100%'}}>

                    <div style={{flexGrow: 1, overflowY: 'auto'}}>

                        <AnnotationRepoTable persistenceLayerManager={this.props.persistenceLayerManager}
                                             updatedDocInfoEventDispatcher={this.props.updatedDocInfoEventDispatcher}
                                             repoDocMetaManager={this.props.repoDocMetaManager}
                                             repoDocMetaLoader={this.props.repoDocMetaLoader}
                                             data={this.props.data}
                                             onSelected={repoAnnotation => this.onRepoAnnotationSelected(repoAnnotation)}/>

                    </div>

                </div>

            );
        }
    };

    public static Default = class extends PreviewAndMainViewDock {

        public render() {

            return (

                <Dock componentClassNames={{
                    right: 'd-none-mobile',
                    splitter: 'd-none-mobile'
                }}
                      left={
                          <PreviewAndMainViewDock.Main {...this.props}/>
                      }
                      right={
                          <div className="mt-2 pl-1 pr-1">
                              <RepoAnnotationMetaView persistenceLayerManager={this.props.persistenceLayerManager}
                                                      repoAnnotation={this.state.repoAnnotation}/>
                          </div>
                      }
                      side='left'
                      initialWidth={450}/>
            );
        }

    }

    public static Phone = class extends PreviewAndMainViewDock {

        public render() {

            return (

              <PreviewAndMainViewDock.Main {...this.props}/>

            );
        }

    }

}

export interface IProps {

    readonly persistenceLayerManager: PersistenceLayerManager;

    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly repoDocMetaLoader: RepoDocMetaLoader;

    readonly updateFilters: UpdateFiltersCallback;

    readonly data: ReadonlyArray<RepoAnnotation>;

}

export interface IState {

    readonly repoAnnotation?: RepoAnnotation;

}

