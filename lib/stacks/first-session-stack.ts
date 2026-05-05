// Stackは、AWSリソースをまとめて管理するための単位です。つまり、CloudFormationスタックです。
import { Stack, type StackProps } from "aws-cdk-lib";

// Constructは、CDKのリソースを定義する際の基本的なビルディングブロックで、スタックやリソースの親子関係を構築するために使用します。
import type { Construct } from "constructs";

// S3バケットを作成するために、aws-cdk-lib から Bucket クラスをインポートしましょう
import { CfnBucket } from "aws-cdk-lib/aws-s3";

export class FirstSessionStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // このバケットは第1回ハンズオンで扱う中心リソースです。
    // まずはL2 でS3バケットを 1 つだけ定義し、define -> synth -> diff -> deploy の流れに集中します。
    const websiteBucket = "ここにバケットを定義しましょう";

    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.Bucket.html

    // 参考：L1バケット、https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.CfnBucket.html
  }
}
