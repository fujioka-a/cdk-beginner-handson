# Session 1: S3 Bucket Construct

## 前提

この手順は、セットアップ後にリソースを作成するためのものです。
前提として、CDK プロジェクトは次のコマンドで作成済みとします。

```bash
cdk init sample-app --language=typescript
```

## このセッションで何をやるか
- 以下を実施します
  - CDKで、L2 Construct の S3 Bucket を 1 つ作成する
  - CDK の基本的な流れを確認する（define -> synth -> diff -> deploy）
- ※`cdk init sample-app` 直後は SNS Topic と SQS Queue のサンプルが入っていますが、Session 1 ではそれらは扱いません。

※正解例は [`lib/stacks_answer/first-session-stack.ts`](../lib/stacks_answer/first-session-stack.ts) にあります。

## 1. FirstSessionStack を作成する

`lib/stacks/first-session-stack.ts` を作成します。

最初は次のように、コメントとプレースホルダーを置いた状態から始めてください。
`"ここにバケットを定義しましょう"` の部分を、S3 Bucket の Construct に置き換えます。

```ts
// Stack は、AWS リソースをまとめて管理するための単位です。つまり、CloudFormation スタックです。
import { CfnOutput, RemovalPolicy, Stack, type StackProps } from "aws-cdk-lib";

// S3 バケットを作成するために、aws-cdk-lib から Bucket クラスをインポートしましょう。
import { Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3";

// Construct は、CDK のリソースを定義する際の基本的なビルディングブロックです。
import type { Construct } from "constructs";

export class FirstSessionStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // このバケットは第1回ハンズオンで扱う中心リソースです。
    // まずは S3 Bucket を 1 つだけ定義し、define -> synth -> diff -> deploy の流れに集中します。
    const websiteBucket = "ここにバケットを定義しましょう";

    // ヒント:
    // - new Bucket(this, "WorkshopBucket", { ... }) を使います。
    // - encryption には BucketEncryption.S3_MANAGED を指定します。
    // - versioned を true にして、生成される CloudFormation テンプレートの差分を見てみましょう。
    // - ハンズオン後に削除しやすいように、removalPolicy と autoDeleteObjects も確認します。
    //
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.Bucket.html

    // Bucket を定義できたら、CfnOutput でバケット名を出力してみましょう。
    // value には websiteBucket.bucketName を指定します。
  }
}
```

ポイント:

- バケット名を指定したい場合には、`bucketName` を使用します。指定しないと、CloudFormationスタック名＋ランダムIDのような形式で自動生成されます。（`WorkshopBucket`は、論理IDであって名前ではありません）
- `RemovalPolicy.DESTROY` と `autoDeleteObjects: true` は、ハンズオン後の片付けをしやすくするための設定です。

## 2. CDK アプリのエントリーポイントを作成する

`bin/workshop.ts` を作成または置き換えます。
Session 1 では `FirstSessionStack` だけを作成します。

```ts
#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { FirstSessionStack } from "../lib/stacks/first-session-stack";

const app = new App();

new FirstSessionStack(app, "FirstSessionStack", {
  stackName: "cdk-workshop-first-session",
});
```

あわせて、`cdk.json` の `app` が `bin/workshop.ts` を参照していることを確認します。(`app`以外は、デフォルトのままでOKです。)

```json
{
  "app": "npx ts-node --prefer-ts-exts bin/workshop.ts"
}
```

## 3. 確認する

まず TypeScript のビルドを確認します。

```bash
npm run build
```

CloudFormation テンプレートを生成します。

```bash
npx cdk synth FirstSessionStack
```

デプロイ前に差分を確認します。

```bash
npx cdk diff FirstSessionStack
```

問題なければデプロイします。

```bash
npx cdk deploy FirstSessionStack
```

デプロイ後、CloudFormation Outputs に `WorkshopBucketName` が表示されれば Session 1 のリソース作成は完了です。

ワークショップ終了後は、作成したリソースを削除してクリーンアップしましょう。

```bash
npx cdk destroy FirstSessionStack
```
