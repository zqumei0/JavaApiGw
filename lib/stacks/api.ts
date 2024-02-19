import { App } from 'aws-cdk-lib';
import {
  LambdaIntegration,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import {
  Code,
  Function as LFunction,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';

import { resolve } from 'path';

import {
  BaseStack,
  BaseStackProps,
} from './base';
import { LAMBDA_BASE_PATH } from '../constants/app-constants';

const ITEM_PACKAGE_PATH = '';
const ITEM_ENTRY_POINT = '';

export interface ApiStackProps extends BaseStackProps {
  readonly itemsTable: TableV2;
}

export class ApiStack extends BaseStack {
  readonly props: ApiStackProps;

  readonly restApi: RestApi;

  constructor(scope: App, id: string, props: ApiStackProps) {
    super(scope, id, props);
    this.props = props;

    this.restApi = this.createApiGateway();
    this.createItemResource();
  }

  private createApiGateway(): RestApi {
    return new RestApi(this, 'RestApi', {
      restApiName: 'ItemRestApi',
    });
  }

  private createItemResource(): void {
    this.restApi.root.addResource('item');
    this.createItemMethods();
  }

  private createItemMethods(): void {
    this.createGetItem();
    this.createPostItem();
    this.createDeleteItem();
  }

  private createGetItem(): void {
    const itemResource = this.restApi.root.getResource('item');
    const itemIdResource = itemResource?.addResource('{itemId}');

    const getItemFunction = new LFunction(this, 'GetItemFunction', {
      code: Code.fromAsset(resolve(__dirname, LAMBDA_BASE_PATH, ITEM_PACKAGE_PATH)),
      environment: {
        ITEM_TABLE: this.props.itemsTable.tableName,
      },
      handler: ITEM_ENTRY_POINT,
      runtime: Runtime.JAVA_17,
    });
    this.props.itemsTable.grantReadData(getItemFunction);

    itemIdResource?.addMethod('GET', new LambdaIntegration(getItemFunction), {});
  }

  private createPostItem(): void {
    const itemResource = this.restApi.root.getResource('item');

    const postItemFunction = new LFunction(this, 'PostItemFunction', {
      code: Code.fromAsset(resolve(__dirname, LAMBDA_BASE_PATH, ITEM_PACKAGE_PATH)),
      environment: {
        ITEM_TABLE: this.props.itemsTable.tableName,
      },
      handler: ITEM_ENTRY_POINT,
      runtime: Runtime.JAVA_17,
    });
    this.props.itemsTable.grantWriteData(postItemFunction);

    itemResource?.addMethod('POST', new LambdaIntegration(postItemFunction), {});
  }

  private createDeleteItem(): void {
    const itemResource = this.restApi.root.getResource('item');

    const deleteItemFunction = new LFunction(this, 'DeleteItemFunction', {
      code: Code.fromAsset(resolve(__dirname, LAMBDA_BASE_PATH, ITEM_PACKAGE_PATH)),
      environment: {
        ITEM_TABLE: this.props.itemsTable.tableName,
      },
      handler: ITEM_ENTRY_POINT,
      runtime: Runtime.JAVA_17,
    });
    this.props.itemsTable.grantWriteData(deleteItemFunction);

    itemResource?.addMethod('DELETE', new LambdaIntegration(deleteItemFunction), {});
  }
}