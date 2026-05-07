import { SqsToLambda } from "@aws-solutions-constructs/aws-sqs-lambda";
import { CfnOutput, Duration, Stack, type StackProps } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { CfnQueue, Queue } from "aws-cdk-lib/aws-sqs";
import type { Construct } from "constructs";

export class SecondSessionStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // L1
    // CfnQueue は CloudFormation にかなり近いレイヤーで、生成されるテンプレートとの対応を見せやすいです。
    const l1Queue = "ここに L1（CloudFormationと同じレベル）で、 標準SQSキュー を定義しましょう";

    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_sqs.CfnQueue.html

    // L2
    // Queue は型付きのプロパティや使いやすい既定値を持ち、普段の CDK 開発で最も触ることが多いレイヤーです。
    const l2Queue = "ここに L2（CDKの標準的なレベル）で、 標準SQSキュー を定義しましょう";

    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_sqs.Queue.html

    // L3
    // AWS 公式の Solutions Constructs が提供する SqsToLambda を使い、SQS + Lambda の構成を高レベルなパターンとして扱います。
    const l3Pattern =
      "ここに L3（AWS公式の高レベルパターン）で、 SQSキュー + Lambda関数 の構成を定義しましょう";

    // https://docs.aws.amazon.com/ja_jp/solutions/latest/constructs/aws_sqs_lambda.html
  }
}
