#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AccountAStack } from '../lib/account-a';
import { AccountBStack } from '../lib/account-b';

const app = new cdk.App();

new AccountAStack(app, 'AccountAStack', {
  env: { account: '$accounta_id', region: 'us-east-1' }
});

new AccountBStack(app, 'AccountBStack', {
  env: { account: '$accountb_id', region: 'us-east-1' }
});