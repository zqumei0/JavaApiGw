import {
  App,
  RemovalPolicy,
} from 'aws-cdk-lib';
import {
  AttributeType,
  TableV2,
} from 'aws-cdk-lib/aws-dynamodb';

import {
  BaseStack,
  BaseStackProps,
} from './base';

export interface DatabaseStackProps extends BaseStackProps {}

export class DatabaseStack extends BaseStack {
  readonly props: DatabaseStackProps;

  readonly table: TableV2;

  constructor(scope: App, id: string, props: DatabaseStackProps) {
    super(scope, id, props);
    this.props = props;

    this.createTransactionTable();
  }

  private createTransactionTable(): TableV2 {
    const partitionKey = { name: 'pk', type: AttributeType.STRING };
    return new TableV2(this, 'TransactionTable', {
      partitionKey,
      removalPolicy: RemovalPolicy.DESTROY,
      tableName: 'TransactionTable',
    });
  }
}