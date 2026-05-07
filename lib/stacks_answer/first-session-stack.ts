import { CfnOutput, RemovalPolicy, Stack, type StackProps } from "aws-cdk-lib";
import { Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3";
import type { Construct } from "constructs";

export class FirstSessionStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // このバケットは第1回ハンズオンで扱う中心リソースです。
    // まずはリソースを 1 つだけ定義し、define -> synth -> diff -> deploy の流れに集中します。
    const websiteBucket = new Bucket(this, "WorkshopBucket", {
      encryption: BucketEncryption.S3_MANAGED,
      versioned: true,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new CfnOutput(this, "WorkshopBucketName", {
      description: "第1回ハンズオンで使用するバケット名です。",
      value: websiteBucket.bucketName,
    });
  }
}
