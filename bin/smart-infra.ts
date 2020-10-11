#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SmartInfraStack } from '../lib/smart-infra-stack';

const app = new cdk.App();
new SmartInfraStack(app, 'SmartInfraStack');
