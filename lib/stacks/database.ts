import {
  App,
  RemovalPolicy,
} from 'aws-cdk-lib';
import {
  AttributeType,
  TableV2,
} from 'aws-cdk-lib/aws-dynamodb';
import {
  Code,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import { TriggerFunction } from 'aws-cdk-lib/triggers';

import { resolve } from 'path';

import {
  BaseStack,
  BaseStackProps,
} from './base';
import { LAMBDA_BASE_PATH } from '../constants/app-constants';

const TABLE_NAME = 'TransactionTable';

export interface DatabaseStackProps extends BaseStackProps {}

export class DatabaseStack extends BaseStack {
  readonly props: DatabaseStackProps;

  readonly table: TableV2;

  constructor(scope: App, id: string, props: DatabaseStackProps) {
    super(scope, id, props);
    this.props = props;

    this.table = this.createTransactionTable();
    this.populateDatabase();
  }

  private createTransactionTable(): TableV2 {
    const partitionKey = { name: 'pk', type: AttributeType.STRING };
    return new TableV2(this, TABLE_NAME, {
      partitionKey,
      removalPolicy: RemovalPolicy.DESTROY,
      tableName: TABLE_NAME,
    });
  }

  private populateDatabase(): void {
    const triggerFunctionName = 'PopulateDatabaseFunction';

    const populateDatabaseFunction = new TriggerFunction(this, triggerFunctionName, {
      code: Code.fromAsset(resolve(__dirname, LAMBDA_BASE_PATH, 'trigger')),
      environment: {
        ITEM_TABLE: TABLE_NAME,
        MOCK_DATA_FILE: 'MOCK_DATA.json',
      },
      handler: 'load_database.handler',
      runtime: Runtime.PYTHON_3_11,
    });
    this.table.grantWriteData(populateDatabaseFunction);
  }
}