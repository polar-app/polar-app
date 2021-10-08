#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {PolarInfrastructure} from '../lib/PolarInfrastructure';

export const envName = () => process.env.ENV_NAME as string;

if (!envName()) {
    throw new Error(`The environment variable process.env.ENV_NAME is not defined. It is used to suffix all CDK stacks that you deploy. Please pass it to "cdk deploy"`);
}

const app = new cdk.App();
// eslint-disable-next-line no-new
new PolarInfrastructure(app, `Polar-${envName()}`, {});
