import * as React from 'react';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {IEventDispatcher} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import AnnotationRepoTable from './AnnotationRepoTable';
import {UpdateFiltersCallback} from './AnnotationRepoFiltersHandler';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Devices} from "../../../../web/js/util/Devices";
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";

export class AnnotationListView extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            repoAnnotation: this.props.repoAnnotation
        };

    }

    public render() {

        const onSelected = (repoAnnotation: IDocAnnotation) => {

            this.onRepoAnnotationSelected(repoAnnotation);

            if (this.props.onSelected) {
                this.props.onSelected(repoAnnotation);
            }

        };

        if (Devices.get() === 'phone') {
            return <AnnotationListView.Phone {...this.props}
                                                 repoAnnotation={this.state.repoAnnotation}
                                                 onSelected={onSelected}/>;
        } else {
            return <AnnotationListView.Default {...this.props}
                                                   repoAnnotation={this.state.repoAnnotation}
                                                   onSelected={onSelected}/>;
        }

    }

    private onRepoAnnotationSelected(repoAnnotation: IDocAnnotation) {
        // console.log("A repo annotation was selected: " , repoAnnotation);
        this.setState({repoAnnotation});
    }

    public static Main = class extends AnnotationListView {

        public render() {

            return (

                <div style={{
                        display: 'flex' ,
                        flexDirection: 'column'
                    }}>

                    <AnnotationRepoTable persistenceLayerManager={this.props.persistenceLayerManager}
                                         updatedDocInfoEventDispatcher={this.props.updatedDocInfoEventDispatcher}
                                         repoDocMetaManager={this.props.repoDocMetaManager}
                                         repoDocMetaLoader={this.props.repoDocMetaLoader}
                                         data={this.props.data}
                                         onSelected={this.props.onSelected || NULL_FUNCTION}/>

                </div>

            );
        }
    };

    public static Default = class extends AnnotationListView {

        public render() {

            return (
                <AnnotationListView.Main {...this.props}/>
            );
        }

    };

    public static Phone = class extends AnnotationListView {

        public render() {

            return (
                <AnnotationListView.Main {...this.props}/>
            );

        }

    };

}

export interface IProps {

    readonly persistenceLayerManager: PersistenceLayerManager;

    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly repoDocMetaLoader: RepoDocMetaLoader;

    readonly updateFilters: UpdateFiltersCallback;

    readonly data: ReadonlyArray<IDocAnnotation>;

    readonly onSelected?: (repoAnnotation: IDocAnnotation) => void;

    readonly repoAnnotation?: IDocAnnotation;

}

export interface IState {

    readonly repoAnnotation?: IDocAnnotation;

}

