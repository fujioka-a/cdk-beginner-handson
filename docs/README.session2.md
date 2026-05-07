# Session 2: SQS Constructs with L1 / L2 / L3

## 前提

この手順は、Session 1 の実装が残っている前提で進めます。
つまり、`FirstSessionStack` で S3 Bucket を作成できる状態から、別スタックとして `SecondSessionStack` を追加します。

## このセッションで何をやるか

- 以下を実施します
  - L1 Construct の `CfnQueue` で SQS Queue を 1 つ作成する
  - L2 Construct の `Queue` で SQS Queue を 1 つ作成する
  - L3 Construct の `SqsToLambda` で SQS Queue + DLQ + Lambda consumer の構成を作成する
  - 実装と`cdk synth` と `cdk diff` で、L1 / L2 / L3 の違いを体感する
- ※L3 では Lambda も作成しますが、これは SQS Queue を処理する consumer として扱います。

※正解例は [`lib/stacks_answer/second-session-stack.ts`](../lib/stacks_answer/second-session-stack.ts) にあります。

## 1. 追加パッケージをインストールする

L3 の例では、AWS 公式の Solutions Constructs が提供する `SqsToLambda` を使います。

```bash
npm install @aws-solutions-constructs/aws-sqs-lambda
```

## 2. Lambda 関数のコードを作成する

L3 の `SqsToLambda` は、SQS Queue と Lambda consumer をまとめて作成します。
その Lambda で実行するコードとして、`lambda/index.js` を作成します。

この Lambda は Session 2 の主役ではありません。
主眼は SQS 関連リソースと Construct レベルの違いを確認することなので、Lambda は受け取ったイベントをログに出すだけの最小実装にします。

```js
// 公式 L3 パターンが作成した SQS キューからメッセージを受け取り、
// Lambda がどのようにイベントを処理するかを確認するための最小実装です。
exports.handler = async (event) => {
  console.log("受信したイベント:", JSON.stringify(event, null, 2));

  return {
    batchItemFailures: [],
  };
};
```

## 3. SecondSessionStack を作成する

`lib/stacks/second-session-stack.ts` を作成します。

最初は次のように、コメントとプレースホルダーを置いた状態から始めてください。
L1 / L2 / L3 のそれぞれで、同じ SQS というサービスを違う抽象度から定義します。

```ts
import { SqsToLambda } from "@aws-solutions-constructs/aws-sqs-lambda";
import { CfnOutput, Duration, Stack, type StackProps } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { CfnQueue, Queue } from "aws-cdk-lib/aws-sqs";
import type { Construct } from "constructs";

export class SecondSessionStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // L1
    // CfnQueue は CloudFormation にかなり近いレイヤーです。
    // 生成される CloudFormation テンプレートとの対応を見せやすいことが特徴です。
    const l1Queue = "ここに L1（CloudFormationと同じレベル）で、標準 SQS キューを定義しましょう";

    // ヒント:
    // - new CfnQueue(this, "L1Queue", { ... }) を使います。
    // - queueName には "cdk-workshop-l1-queue" を指定します。
    // - visibilityTimeout には number として 30 を指定します。
    //
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_sqs.CfnQueue.html

    // L1 Queue を定義できたら、CfnOutput でキュー名を出力してみましょう。
    // Output 名は "L1QueueName" にします。

    // L2
    // Queue は型付きのプロパティや使いやすい既定値を持つ、CDK の標準的なレイヤーです。
    // 普段の CDK 開発では、この L2 Construct を使うことが多いです。
    const l2Queue = "ここに L2（CDKの標準的なレベル）で、標準 SQS キューを定義しましょう";

    // ヒント:
    // - new Queue(this, "L2Queue", { ... }) を使います。
    // - queueName には "cdk-workshop-l2-queue" を指定します。
    // - visibilityTimeout には Duration.seconds(30) を指定します。
    //
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_sqs.Queue.html

    // L2 Queue を定義できたら、CfnOutput でキュー URL を出力してみましょう。
    // Output 名は "L2QueueUrl" にします。

    // L3
    // AWS 公式の Solutions Constructs が提供する SqsToLambda を使います。
    // SQS Queue + DLQ + Lambda consumer + event source mapping を、公式パターンとしてまとめて定義します。
    const l3Pattern =
      "ここに L3（AWS公式の高レベルパターン）で、SQS キュー + Lambda 関数の構成を定義しましょう";

    // ヒント:
    // - new SqsToLambda(this, "L3SqsToLambdaPattern", { ... }) を使います。
    // - queueProps でメインキューの queueName と visibilityTimeout を指定します。
    // - deadLetterQueueProps で DLQ の queueName を指定します。
    // - lambdaFunctionProps で runtime, handler, code を指定します。
    // - runtime は lambda.Runtime.NODEJS_22_X を使います。
    // - code は lambda.Code.fromAsset("lambda") を使います。
    //
    // https://docs.aws.amazon.com/ja_jp/solutions/latest/constructs/aws_sqs_lambda.html

    // L3 Pattern を定義できたら、CfnOutput で次の値を出力してみましょう。
    // - L3QueueUrl
    // - L3DeadLetterQueueUrl
    // - L3LambdaName
  }
}
```

ポイント:

- `CfnQueue` は CloudFormation リソースに近い L1 Construct です。
- `Queue` は CDK らしい型付きの L2 Construct です。
- `SqsToLambda` は、複数リソースの組み合わせを公式パターンとして扱う L3 Construct です。
- `queueName` を指定しているため、同じ AWS アカウント・同じリージョンに同じ名前のキューが既にあるとデプロイに失敗します。

## 4. CDK アプリのエントリーポイントを更新する

`bin/workshop.ts` に `SecondSessionStack` を追加します。
Session 1 の `FirstSessionStack` は残したままにします。

```ts
#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { FirstSessionStack } from "../lib/stacks/first-session-stack";
import { SecondSessionStack } from "../lib/stacks/second-session-stack";

const app = new App();

new FirstSessionStack(app, "FirstSessionStack", {
  stackName: "cdk-workshop-first-session",
});

new SecondSessionStack(app, "SecondSessionStack", {
  stackName: "cdk-workshop-second-session",
});
```

`cdk.json` の `app` は、Session 1 で設定した `bin/workshop.ts` のままでOKです。

```json
{
  "app": "npx ts-node --prefer-ts-exts bin/workshop.ts"
}
```

## 5. 確認する

まず TypeScript のビルドを確認します。

```bash
npm run build
```

CloudFormation テンプレートを生成します。
L1 / L2 / L3 で作成される SQS 関連リソースの違いを確認してください。

```bash
npx cdk synth SecondSessionStack
```

デプロイ前に差分を確認します。

```bash
npx cdk diff SecondSessionStack
```

問題なければデプロイします。

```bash
npx cdk deploy SecondSessionStack
```

デプロイ後、CloudFormation Outputs に次の値が表示されれば Session 2 のリソース作成は完了です。

- `L1QueueName`
- `L2QueueUrl`
- `L3QueueUrl`
- `L3DeadLetterQueueUrl`
- `L3LambdaName`

ワークショップ終了後は、作成したリソースを削除してクリーンアップしましょう。

```bash
npx cdk destroy SecondSessionStack
```
