import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import {MessageBanner} from '../MessageBanner';
import {Line, Doughnut} from 'react-chartjs-2';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {Statistics} from '../../../../web/js/metadata/Statistics';
import * as chartjs from 'chart.js';
import {DocInfo, IDocInfo} from '../../../../web/js/metadata/DocInfo';
import { ResponsivePie } from '@nivo/pie';

const log = Logger.create();

export default class StatTitle extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <div className="pt-1 pb-1 w-100 text-center"
                 style={{fontWeight: 'bold', fontSize: '18px'}}>

                {this.props.children}

            </div>

        );
    }

}
