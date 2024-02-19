import { App } from 'aws-cdk-lib';

import { DatabaseStack } from './stacks/database';

const app = new App();
new DatabaseStack(app, 'DatabaseStack', {
  stackName: 'DatabaseStack',
});

