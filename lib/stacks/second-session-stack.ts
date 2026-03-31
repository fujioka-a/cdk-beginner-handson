import { SqsToLambda } from "@aws-solutions-constructs/aws-sqs-lambda";
import { CfnOutput, Duration, Stack, type StackProps } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { CfnQueue, Queue } from "aws-cdk-lib/aws-sqs";
import type { Construct } from "constructs";
import { applyWorkshopTags } from "../shared/tags";

export class SecondSessionStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    applyWorkshopTags(this);

    // L1 の例です。
    // CfnQueue は CloudFormation にかなり近いレイヤーで、生成されるテンプレートとの対応を見せやすいです。
    const l1Queue = new CfnQueue(this, "L1Queue", {
      queueName: "cdk-workshop-l1-queue",
      visibilityTimeout: 30,
    });

    new CfnOutput(this, "L1QueueName", {
      description: "L1 の CfnQueue 例で作成したキュー名です。",
      value: l1Queue.queueName ?? "cdk-workshop-l1-queue",
    });

    // L2 の例です。
    // Queue は型付きのプロパティや使いやすい既定値を持ち、普段の CDK 開発で最も触ることが多いレイヤーです。
    const l2Queue = new Queue(this, "L2Queue", {
      queueName: "cdk-workshop-l2-queue",
      visibilityTimeout: Duration.seconds(30),
    });

    new CfnOutput(this, "L2QueueUrl", {
      description: "L2 の Queue 例で作成したキュー URL です。",
      value: l2Queue.queueUrl,
    });

    // L3 の例です。
    // AWS 公式の Solutions Constructs が提供する SqsToLambda を使い、
    // SQS + Lambda の構成を高レベルなパターンとして扱います。
    const l3Pattern = new SqsToLambda(this, "L3SqsToLambdaPattern", {
      queueProps: {
        queueName: "cdk-workshop-l3-pattern-queue",
        visibilityTimeout: Duration.seconds(30),
      },
      deadLetterQueueProps: {
        queueName: "cdk-workshop-l3-pattern-dlq",
      },
      maxReceiveCount: 3,
      lambdaFunctionProps: {
        functionName: "cdk-workshop-l3-pattern-processor",
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset("lambda"),
      },
    });

    new CfnOutput(this, "L3QueueUrl", {
      description: "L3 の公式パターン例で作成した SQS キュー URL です。",
      value: l3Pattern.sqsQueue.queueUrl,
    });

    new CfnOutput(this, "L3DeadLetterQueueUrl", {
      description: "L3 の公式パターン例で作成した DLQ の URL です。",
      value: l3Pattern.deadLetterQueue?.queue.queueUrl ?? "DLQ は作成されていません。",
    });

    new CfnOutput(this, "L3LambdaName", {
      description: "L3 の公式パターン例で作成した Lambda 関数名です。",
      value: l3Pattern.lambdaFunction.functionName,
    });
  }
}
