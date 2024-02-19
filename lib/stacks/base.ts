import {
  App,
  Stack,
  StackProps,
} from 'aws-cdk-lib';

export interface BaseStackProps extends StackProps {}

export class BaseStack extends Stack {
  readonly props: BaseStackProps;

  constructor(scope: App, id: string, props: BaseStackProps) {
    super(scope, id, props);
    this.props = props;
  }
}